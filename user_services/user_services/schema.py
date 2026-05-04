import logging
from typing import Annotated

from fastapi import Depends
from passlib.context import CryptContext
from sqlmodel import Session, select

from .database import get_session
from .model import User

logger = logging.getLogger("user_services.schema")
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def authenticate_user(
    username: str, password: str, db: Annotated[Session, Depends(get_session)]
):
    """Authenticate a user by username.

    This function is defensive:
    - It searches by username only.
    - It returns False if no user is found or if the user has no local password
      (e.g. Google-authenticated accounts).
    - It never raises an unexpected exception during verification.
    """
    logger.debug("authenticate_user called with username=%s", username)

    stmt = select(User).where(User.username == username)
    user = db.exec(stmt).first()
    if not user:
        logger.debug("authenticate_user: no user found for identifier=%s", username)
        return False

    # If the user was created via an external provider (Google) they may not have
    # a local password set. In that case, disallow password login here.
    if not user.hashed_password:
        logger.debug(
            "authenticate_user: user %s has no local password (auth_provider=%s)",
            user.email,
            user.auth_provider,
        )
        return False

    try:
        verified = bcrypt_context.verify(password, user.hashed_password)
    except Exception as e:
        # Any error during verification should be treated as a failed auth.
        logger.exception(
            "authenticate_user: error verifying password for user %s: %s",
            user.email,
            e,
        )
        return False

    if not verified:
        logger.debug(
            "authenticate_user: password verification failed for user %s", user.email
        )
        return False

    logger.info("authenticate_user: user %s authenticated successfully", user.email)
    return user
