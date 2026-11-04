import os
import secrets
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://127.0.0.1:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "rishirides")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
OTP_EXPIRE_MINUTES = int(os.getenv("OTP_EXPIRE_MINUTES", "5"))
OTP_PROVIDER = os.getenv(
    "OTP_PROVIDER",
    "simulator" if ENVIRONMENT == "development" else "email-smtp",
)
OTP_HASH_SECRET = os.getenv("OTP_HASH_SECRET", "")
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)
SMTP_SECURE = os.getenv("SMTP_SECURE", "true").lower() == "true"

if ENVIRONMENT != "development" and OTP_PROVIDER == "simulator":
    raise ValueError("Non-development environments require a real OTP delivery provider.")
if OTP_PROVIDER not in ("simulator", "email-smtp"):
    raise ValueError("OTP_PROVIDER must be simulator or email-smtp.")
if OTP_PROVIDER == "email-smtp" and not all((SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM)):
    raise ValueError("Email OTP requires SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.")
if ENVIRONMENT != "development" and len(OTP_HASH_SECRET) < 32:
    raise ValueError("Non-development environments require an OTP_HASH_SECRET of at least 32 characters.")
if not OTP_HASH_SECRET:
    OTP_HASH_SECRET = secrets.token_hex(32)
