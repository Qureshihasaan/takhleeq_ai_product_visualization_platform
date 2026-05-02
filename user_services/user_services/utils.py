from datetime import datetime, timedelta

from fastapi import HTTPException, status
from jose import jwt
from jose.exceptions import ExpiredSignatureError, JWTError

from . import setting


def create_access_token(
    username: str, user_id: int, role: str, expires_delta: timedelta
):
    """Create a JWT access token with an expiration claim.

    The function embeds `sub`, `id`, and `role` claims and sets `exp` to
    now + `expires_delta`.
    """
    encode = {"sub": username, "id": user_id, "role": role}
    expires = datetime.utcnow() + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, str(setting.SECRET_KEY), algorithm=setting.ALGORITHM)


def decode_access_token(access_token: str):
    """Decode a JWT and translate JWT errors into HTTPExceptions.

    This centralizes error handling so FastAPI returns a 401 for expired or
    invalid tokens instead of crashing with a 500.
    """
    try:
        decoded_jwt = jwt.decode(
            access_token, str(setting.SECRET_KEY), algorithms=[setting.ALGORITHM]
        )
        return decoded_jwt
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    except Exception:
        # Fallback for any other errors raised by the JWT library
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )


def verify_access_token(token: str):
    """Alias for decoding a token; mirrors the same error handling semantics."""
    try:
        payload = jwt.decode(
            token, str(setting.SECRET_KEY), algorithms=[setting.ALGORITHM]
        )
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired"
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
