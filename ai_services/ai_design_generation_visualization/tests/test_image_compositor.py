import pytest
import numpy as np
import base64
from ai_agents.image_compositor import _decode_image

def test_decode_image_with_correct_padding():
    # 1x1 PNG image base64
    valid_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    img = _decode_image(valid_b64)
    assert isinstance(img, np.ndarray)
    assert img.shape == (1, 1, 4)  # 1x1 image, converted to BGRA

def test_decode_image_with_missing_padding():
    # Strip the trailing "==" from the valid base64 string
    bad_padding_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg"
    img = _decode_image(bad_padding_b64)
    assert isinstance(img, np.ndarray)
    assert img.shape == (1, 1, 4)

def test_decode_image_with_data_uri_prefix_and_whitespace():
    # Base64 with data URI prefix and some newlines/spaces
    b64_with_prefix = (
        "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUl\n"
        "EQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==\n"
    )
    img = _decode_image(b64_with_prefix)
    assert isinstance(img, np.ndarray)
    assert img.shape == (1, 1, 4)

def test_decode_image_with_url():
    from unittest.mock import patch, MagicMock
    valid_png_bytes = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")
    
    mock_response = MagicMock()
    mock_response.read.return_value = valid_png_bytes
    mock_response.__enter__.return_value = mock_response
    
    with patch("urllib.request.urlopen", return_value=mock_response) as mock_urlopen:
        img = _decode_image("https://example.com/test.png")
        assert isinstance(img, np.ndarray)
        assert img.shape == (1, 1, 4)
        mock_urlopen.assert_called_once()

