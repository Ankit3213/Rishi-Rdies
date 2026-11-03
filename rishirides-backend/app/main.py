from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import close_database, connect_database
from app.routes.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_database()
    try:
        yield
    finally:
        await close_database()


app = FastAPI(
    title="RishiRides API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:19006",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/")
async def home():
    return {"message": "RishiRides API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
