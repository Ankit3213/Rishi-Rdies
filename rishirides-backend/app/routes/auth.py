import asyncio
import hashlib
import hmac
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from pwdlib import PasswordHash

from app.config import (
    ENVIRONMENT,
    OTP_EXPIRE_MINUTES,
    OTP_HASH_SECRET,
    OTP_PROVIDER,
    SMTP_FROM,
    SMTP_HOST,
    SMTP_PASSWORD,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
)
from app.database import db, otp_sessions, users

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


def hash_otp(value: str) -> str:
    return hmac.new(
        OTP_HASH_SECRET.encode(),
        value.encode(),
        hashlib.sha256,
    ).hexdigest()


def send_otp_email(email: str, otp: str) -> None:
    message = EmailMessage()
    message["From"] = SMTP_FROM
    message["To"] = email
    message["Subject"] = "Your RishiRide verification code"
    message.set_content(
        f"Your RishiRide verification code is {otp}. "
        f"It expires in {OTP_EXPIRE_MINUTES} minutes. "
        "If you did not request this code, you can ignore this email."
    )

    if SMTP_SECURE:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(message)
        return

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(message)


async def deliver_otp(email: str, otp: str) -> None:
    if OTP_PROVIDER == "simulator":
        return
    try:
        await asyncio.to_thread(send_otp_email, email, otp)
    except (OSError, smtplib.SMTPException) as error:
        raise HTTPException(
            503,
            "Could not send the verification code. Please try again.",
        ) from error


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

    if otp and OTP_PROVIDER == "simulator" and ENVIRONMENT == "development":
        result["developmentOtp"] = otp

    return result


async def create_otp_session(user, role):
    otp = f"{secrets.randbelow(1_000_000):06d}"
    session_id = secrets.token_urlsafe(24)
    created_at = now()

    await otp_sessions.delete_many({"userId": str(user["_id"])})
    session = {
        "sessionId": session_id,
        "userId": str(user["_id"]),
        "mobile": user["mobile"],
        "email": user.get("email"),
        "role": role,
        "otpHash": hash_otp(otp),
        "attempts": 0,
        "resends": 0,
        "expiresAt": created_at + timedelta(minutes=OTP_EXPIRE_MINUTES),
        "createdAt": created_at,
        "deliveryMethod": "email",
    }

    await otp_sessions.insert_one(session)
    try:
        await deliver_otp(session["email"], otp)
    except HTTPException:
        await otp_sessions.delete_one({"sessionId": session_id})
        raise
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

    try:
        return await create_otp_session(user, "passenger")
    except HTTPException:
        await users.delete_one({"_id": user["_id"], "isMobileVerified": False})
        raise


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

    otp_hash = hash_otp(data.otp.strip())
    if not secrets.compare_digest(session["otpHash"], otp_hash):
        await otp_sessions.update_one(
            {"_id": session["_id"], "attempts": {"$lt": 5}},
            {"$inc": {"attempts": 1}}
        )
        raise HTTPException(400, "The OTP is incorrect or has expired.")

    consumed = await otp_sessions.delete_one({
        "_id": session["_id"],
        "otpHash": otp_hash,
        "attempts": {"$lt": 5},
        "expiresAt": {"$gt": now()},
    })
    if consumed.deleted_count != 1:
        raise HTTPException(400, "The OTP is incorrect, expired, or already used.")

    user = await users.find_one({"_id": ObjectId(session["userId"])})

    if not user:
        raise HTTPException(404, "User account not found.")

    await users.update_one(
        {"_id": user["_id"]},
        {"$set": {"isEmailVerified": True, "updatedAt": now()}}
    )

    token = await issue_auth_token(user)

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
    if session.get("resends", 0) >= 5:
        raise HTTPException(429, "Too many OTP resend attempts. Please start again.")

    otp = f"{secrets.randbelow(1_000_000):06d}"
    expires_at = now() + timedelta(minutes=OTP_EXPIRE_MINUTES)

    updated = await otp_sessions.update_one(
        {
            "_id": session["_id"],
            "otpHash": session["otpHash"],
            "$or": [
                {"resends": {"$lt": 5}},
                {"resends": {"$exists": False}},
            ],
        },
        {"$set": {
            "otpHash": hash_otp(otp),
            "attempts": 0,
            "expiresAt": expires_at,
        }, "$inc": {"resends": 1}}
    )
    if updated.modified_count != 1:
        raise HTTPException(429, "The verification session changed. Please start again.")

    try:
        await deliver_otp(session["email"], otp)
    except HTTPException:
        await otp_sessions.delete_one({"_id": session["_id"]})
        raise
    session["otpHash"] = hash_otp(otp)
    session["attempts"] = 0
    session["resends"] = session.get("resends", 0) + 1
    session["expiresAt"] = expires_at
    return public_login_response(session, otp)
