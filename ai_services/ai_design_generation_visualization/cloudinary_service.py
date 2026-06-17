import base64
import logging
from typing import Optional

import config

logger = logging.getLogger(__name__)

try:
    import cloudinary
    import cloudinary.uploader
except Exception:  # pragma: no cover
    cloudinary = None


def _is_configured() -> bool:
    return bool(
        cloudinary
        and config.CLOUDINARY_CLOUD_NAME
        and config.CLOUDINARY_API_KEY
        and config.CLOUDINARY_API_SECRET
    )


def _configure_client() -> bool:
    if not _is_configured():
        return False
    cloudinary.config(
        cloud_name=config.CLOUDINARY_CLOUD_NAME,
        api_key=config.CLOUDINARY_API_KEY,
        api_secret=config.CLOUDINARY_API_SECRET,
        secure=True,
    )
    return True


def upload_base64_image(image_data: str, filename: str) -> Optional[str]:
    """Upload a base64/data URL image to the same Cloudinary folder as products."""
    if not image_data or image_data.startswith("http"):
        return image_data or None
    if not _configure_client():
        logger.warning("Cloudinary is not configured. Keeping confirmed design in DB only.")
        return None

    try:
        # Clean up formatting, quotes, and whitespace
        cleaned = image_data.strip().strip('"').strip("'")
        if cleaned.startswith("data:"):
            cleaned = cleaned.split("base64,", 1)[-1]
        
        # Remove all internal whitespaces/newlines
        cleaned = "".join(cleaned.split())
        
        # Ensure correct padding
        missing_padding = len(cleaned) % 4
        if missing_padding:
            cleaned += '=' * (4 - missing_padding)
            
        file_bytes = base64.b64decode(cleaned)
        result = cloudinary.uploader.upload(
            file_bytes,
            folder="takhleeq/products",
            resource_type="image",
            public_id=filename,
            unique_filename=True,
            overwrite=False,
        )
        return result.get("secure_url")
    except Exception as exc:
        logger.error("Cloudinary upload failed for confirmed design: %s", exc)
        return None
