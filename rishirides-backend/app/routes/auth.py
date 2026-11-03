import hashlib
import random
import secrets
from datetime import datetime, timedelta, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from firebase_admin import auth as firebase_auth
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash

from app.config import ENVIRONMENT, OTP_EXPIRE_MINUTES
from app.database import db, google_registrations, otp_sessions, users
from app.services.firebase_auth import verify_firebase_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
password_hash = PasswordHash.recommended()


def now():
    return datetime.now(timezone.utc)


def is_expired(expires_at: datetime) -> bool:
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    return expires_at <= now()


def hash_value(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def mask_mobile(mobile: str) -> str:
    return "******" + mobile[-4:]


def mask_email(email: str) -> str:
    name, domain = email.split("@", 1)
    return (name[:1] + "***@" + domain) if name else "***@" + domain


def issue_token():
    return secrets.token_urlsafe(40)


def public_login_response(session, otp=None):
    result = {
        "sessionId": session["sessionId"],
        "mobile": session["mobile"],
        "deliveryMethod": session["deliveryMethod"],
        "role": session["role"],
        "maskedMobile": mask_mobile(session["mobile"]),
    }

    if session.get("email"):
        result["maskedEmail"] = mask_email(session["email"])

    if otp and ENVIRONMENT == "development":
        result["developmentOtp"] = otp

    return result


async def create_otp_session(user, role):
    otp = f"{random.SystemRandom().randint(0, 999999):06d}"
    session_id = secrets.token_urlsafe(24)
    created_at = now()

    session = {
        "sessionId": session_id,
        "userId": str(user["_id"]),
        "mobile": user["mobile"],
        "email": user.get("email"),
        "role": role,
        "otpHash": hash_value(otp),
        "attempts": 0,
        "expiresAt": created_at + timedelta(minutes=OTP_EXPIRE_MINUTES),
        "createdAt": created_at,
        "deliveryMethod": "sms",
    }

    await otp_sessions.insert_one(session)
    return public_login_response(session, otp)


async def issue_auth_token(user):
    token = issue_token()

    await db.auth_sessions.insert_one({
        "userId": str(user["_id"]),
        "tokenHash": hash_value(token),
        "createdAt": now(),
        "expiresAt": now() + timedelta(days=30),
    })

    return token


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    mobile: str = Field(min_length=10, max_length=15)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: str = "passenger"


class LoginRequest(BaseModel):
    email: EmailStr
    mobile: str
    password: str
    role: str


class GoogleRequest(BaseModel):
    idToken: str = Field(min_length=1)


class GoogleCompleteRequest(BaseModel):
    registrationToken: str = Field(min_length=1)
    mobile: str = Field(min_length=10, max_length=15)


class OtpRequest(BaseModel):
    sessionId: str = Field(min_length=1)
    mobile: str = Field(min_length=10, max_length=15)
    otp: str = Field(pattern=r"^\d{6}$")


class ResendOtpRequest(BaseModel):
    sessionId: str = Field(min_length=1)
    mobile: str = Field(min_length=10, max_length=15)


@router.post("/register")
async def register(data: RegisterRequest):
    if data.role != "passenger":
        raise HTTPException(400, "Passenger registration is required here.")

    email = str(data.email).strip().lower()
    mobile = data.mobile.strip()

    if await users.find_one({"$or": [{"email": email}, {"mobile": mobile}]}):
        raise HTTPException(409, "An account with this email or mobile already exists.")

    created_at = now()
    user = {
        "name": data.name.strip(),
        "email": email,
        "mobile": mobile,
        "passwordHash": password_hash.hash(data.password),
        "role": "passenger",
        "authProvider": "password",
        "isActive": True,
        "isMobileVerified": False,
        "createdAt": created_at,
        "updatedAt": created_at,
    }

    result = await users.insert_one(user)
    user["_id"] = result.inserted_id

    return await create_otp_session(user, "passenger")


@router.post("/login")
async def login(data: LoginRequest):
    role = data.role.lower().strip()

    if role not in ("passenger", "driver"):
        raise HTTPException(400, "Invalid account role.")

    mobile = data.mobile.strip()
    email = str(data.email).strip().lower()

    user = await users.find_one({
        "$or": [{"email": email}, {"mobile": mobile}]
    })

    if (
        not user
        or user.get("role") != role
        or not user.get("passwordHash")
        or not password_hash.verify(data.password, user["passwordHash"])
        or not user.get("isActive", True)
    ):
        raise HTTPException(401, "Invalid login details.")

    return await create_otp_session(user, role)


@router.post("/verify-otp")
async def verify_otp(data: OtpRequest):
    session = await otp_sessions.find_one({
        "sessionId": data.sessionId,
        "mobile": data.mobile.strip(),
    })

    if not session:
        raise HTTPException(404, "OTP session not found.")

    if is_expired(session["expiresAt"]):
        await otp_sessions.delete_one({"_id": session["_id"]})
        raise HTTPException(400, "The OTP has expired. Please request another.")

    if session["attempts"] >= 5:
        await otp_sessions.delete_one({"_id": session["_id"]})
        raise HTTPException(429, "Too many incorrect OTP attempts.")

    if not secrets.compare_digest(
        session["otpHash"], hash_value(data.otp.strip())
    ):
        await otp_sessions.update_one(
            {"_id": session["_id"]},
            {"$inc": {"attempts": 1}}
        )
        raise HTTPException(400, "The OTP is incorrect or has expired.")

    user = await users.find_one({"_id": ObjectId(session["userId"])})

    if not user:
        raise HTTPException(404, "User account not found.")

    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {"isMobileVerified": True, "updatedAt": now()}}
    )

    token = await issue_auth_token(user)
    await otp_sessions.delete_one({"_id": session["_id"]})

    return {"verified": True, "token": token}


@router.post("/resend-otp")
async def resend_otp(data: ResendOtpRequest):
    session = await otp_sessions.find_one({
        "sessionId": data.sessionId,
        "mobile": data.mobile.strip(),
    })

    if not session:
        raise HTTPException(404, "OTP session not found.")

    if is_expired(session["expiresAt"]):
        await otp_sessions.delete_one({"_id": session["_id"]})
        raise HTTPException(400, "OTP session expired. Please login again.")

    otp = f"{random.SystemRandom().randint(0, 999999):06d}"

    await otp_sessions.update_one(
        {"_id": session["_id"]},
        {"$set": {
            "otpHash": hash_value(otp),
            "attempts": 0,
            "expiresAt": now() + timedelta(minutes=OTP_EXPIRE_MINUTES),
        }}
    )

    if ENVIRONMENT == "development":
        return {"message": "OTP generated.", "developmentOtp": otp}

    return {"message": "OTP delivery must be configured."}


@router.post("/google")
async def google_login(data: GoogleRequest):
    try:
        firebase_user = verify_firebase_token(data.idToken)
    except (
        firebase_auth.InvalidIdTokenError,
        firebase_auth.ExpiredIdTokenError,
        firebase_auth.RevokedIdTokenError,
        firebase_auth.UserDisabledError,
    ):
        raise HTTPException(401, "Google authentication failed. Please sign in again.")

    firebase_claims = firebase_user.get("firebase", {})
    if firebase_claims.get("sign_in_provider") != "google.com":
        raise HTTPException(401, "Please sign in with a Google account.")

    email = (firebase_user.get("email") or "").strip().lower()
    uid = firebase_user.get("uid")

    if not email or not uid or not firebase_user.get("email_verified"):
        raise HTTPException(400, "A verified Google account email is required.")

    user = await users.find_one({"$or": [
        {"firebaseUid": uid},
        {"email": email},
    ]})

    if user:
        if not user.get("isActive", True):
            raise HTTPException(403, "This account is disabled.")

        if user.get("role") != "passenger":
            raise HTTPException(403, "This Google account is not a passenger account.")

        await users.update_one(
            {"_id": user["_id"]},
            {"$set": {"firebaseUid": uid, "updatedAt": now()}}
        )

        token = await issue_auth_token(user)
        return {
            "authenticated": True,
            "token": token,
            "mobile": user["mobile"],
            "role": "passenger",
        }

    registration_token = issue_token()

    await google_registrations.insert_one({
        "tokenHash": hash_value(registration_token),
        "firebaseUid": uid,
        "email": email,
        "name": firebase_user.get("name") or email.split("@")[0],
        "expiresAt": now() + timedelta(minutes=10),
        "createdAt": now(),
    })

    return {
        "needsMobile": True,
        "registrationToken": registration_token,
        "email": email,
        "name": firebase_user.get("name") or email.split("@")[0],
    }


@router.post("/google/complete")
async def complete_google_signup(data: GoogleCompleteRequest):
    registration = await google_registrations.find_one({
        "tokenHash": hash_value(data.registrationToken),
        "expiresAt": {"$gt": now()},
    })

    if not registration:
        raise HTTPException(400, "Google registration expired. Please sign in again.")

    mobile = data.mobile.strip()

    existing = await users.find_one({"$or": [
        {"mobile": mobile},
        {"email": registration["email"]},
    ]})

    if existing:
        raise HTTPException(409, "An account with this email or mobile already exists.")

    created_at = now()
    user = {
        "name": registration["name"],
        "email": registration["email"],
        "mobile": mobile,
        "firebaseUid": registration["firebaseUid"],
        "role": "passenger",
        "authProvider": "google",
        "isActive": True,
        "isMobileVerified": False,
        "createdAt": created_at,
        "updatedAt": created_at,
    }

    result = await users.insert_one(user)
    user["_id"] = result.inserted_id

    await google_registrations.delete_one({"_id": registration["_id"]})

    token = await issue_auth_token(user)

    return {
        "authenticated": True,
        "token": token,
        "mobile": mobile,
        "role": "passenger",
    }
