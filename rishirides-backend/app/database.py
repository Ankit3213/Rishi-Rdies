from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, DATABASE_NAME

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

users = db["users"]
otp_sessions = db["otp_sessions"]
rides = db["rides"]

async def connect_database():
    await client.admin.command("ping")
    print("MongoDB connected successfully")

async def close_database():
    client.close()
