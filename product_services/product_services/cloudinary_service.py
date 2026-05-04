import logging
import re
from typing import Optional

from . import setting

logger = logging.getLogger(__name__)

try:
    import cloudinary
    import cloudinary.uploader
except Exception:  # pragma: no cover
    cloudinary = None


def _is_configured() -> bool:
    return bool(
        cloudinary
        and setting.CLOUDINARY_CLOUD_NAME
        and setting.CLOUDINARY_API_KEY
        and setting.CLOUDINARY_API_SECRET
    )


def _configure_client() -> bool:
    if not _is_configured():
        return False
    cloudinary.config(
        cloud_name=setting.CLOUDINARY_CLOUD_NAME,
        api_key=setting.CLOUDINARY_API_KEY,
        api_secret=setting.CLOUDINARY_API_SECRET,
        secure=True,
    )
    return True


def upload_image(file_bytes: bytes, filename: Optional[str] = None) -> Optional[str]:
    """Upload image bytes to Cloudinary. Returns secure_url or None."""
    if not _configure_client():
        return None
    try:
        result = cloudinary.uploader.upload(
            file_bytes,
            folder="takhleeq/products",
            resource_type="image",
            public_id=None if not filename else filename.rsplit(".", 1)[0],
            unique_filename=True,
            overwrite=False,
        )
        return result.get("secure_url")
    except Exception as exc:
        logger.error("Cloudinary upload failed: %s", exc)
        return None


def _extract_public_id(image_url: str) -> Optional[str]:
    match = re.search(r"/upload/(?:v\d+/)?(.+)$", image_url)
    if not match:
        return None
    with_ext = match.group(1)
    public_id = re.sub(r"\.[a-zA-Z0-9]+$", "", with_ext)
    return public_id


def delete_image(image_url: str) -> bool:
    """Delete Cloudinary image by URL."""
    if not _configure_client() or not image_url.startswith("http"):
        return False
    public_id = _extract_public_id(image_url)
    if not public_id:
        return False
    try:
        cloudinary.uploader.destroy(public_id, resource_type="image")
        return True
    except Exception as exc:
        logger.error("Cloudinary delete failed: %s", exc)
        return False

