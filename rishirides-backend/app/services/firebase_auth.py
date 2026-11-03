from pathlib import Path

import firebase_admin
from firebase_admin import auth, credentials

from app.config import FIREBASE_SERVICE_ACCOUNT


def initialize_firebase():
    try:
        return firebase_admin.get_app()
    except ValueError:
        credentials_path = Path(FIREBASE_SERVICE_ACCOUNT)
        if not credentials_path.is_absolute():
            credentials_path = Path(__file__).resolve().parents[2] / credentials_path

        if not credentials_path.is_file():
            raise FileNotFoundError(
                f"Firebase service account not found: {credentials_path}"
            )

        cred = credentials.Certificate(str(credentials_path))
        return firebase_admin.initialize_app(cred)


def verify_firebase_token(id_token: str):
    return auth.verify_id_token(
        id_token,
        app=initialize_firebase(),
        check_revoked=True
    )
