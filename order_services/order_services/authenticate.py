from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
import os
from fastapi.security import HTTPBearer

# from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta
from . import setting


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="http://localhost:8002/login")


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, setting.SECRET_KEY, algorithms=[setting.ALGORITHMS])
        if datetime.utcnow() > datetime.utcfromtimestamp(payload["exp"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return payload
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def validate_role(required_roles: list[str]):
    def role_checker(token_data: dict = Depends(verify_token)):
        user_role = token_data.get("role")
        if user_role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user_role}' is not authorized to perform this action"
            )
        return token_data
    return role_checker
