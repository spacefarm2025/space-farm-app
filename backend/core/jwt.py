import jwt
import datetime
from typing import TypedDict, Optional

JWT_SECRET_KEY = 'your_secret_key'


class AuthToken(TypedDict):
    address: str
    network: str


class PayloadToken(TypedDict):
    payload: str


def build_create_token(expiration_time: datetime.timedelta):
    def create_token(**kwargs) -> str:
        headers = {"alg": "HS256"}
        exp = datetime.datetime.utcnow() + expiration_time
        token = jwt.encode({**kwargs, "exp": exp}, JWT_SECRET_KEY, algorithm="HS256", headers=headers)
        return token

    return create_token


create_auth_token = build_create_token(datetime.timedelta(days=720))  # 2 years
create_payload_token = build_create_token(datetime.timedelta(minutes=15))  # 15 minutes


def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None


def build_decode_token():
    def decode_token(token: str) -> Optional[dict]:
        try:
            decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"], options={"verify_exp": False})
            return decoded

        except jwt.InvalidTokenError:
            return None

    return decode_token


decode_auth_token = build_decode_token()
decode_payload_token = build_decode_token()
