"""
Quick integration test for the /predict contract with Person 3.

Verifies:
- confidence is always the raw model score (never overridden by a
  threshold check on our side - that's Person 3's 0.90 cutoff job)
- the old invented "status" field (healthy/detected/uncertain) is gone
- is_plant / supported_crop / crop_match come back as separate flags
- non-plant and unsupported-crop cases still behave sensibly

Run with:  pytest test_api_main.py -v
Needs:     pip install pytest httpx   (httpx powers FastAPI's TestClient)

Note: ultralytics.YOLO is stubbed out below so this doesn't need your
real model weights, a GPU, or a `models/best.pt` file to run - it only
checks the API contract/shape, not detection accuracy. Put this file
in the same folder as api_main.py before running it.
"""

import sys
from types import SimpleNamespace
from unittest.mock import patch

import pytest


# --- Stub ultralytics BEFORE importing api_main, so api_main's
# `model = YOLO(MODEL_PATH)` at import time doesn't need real weights ---
class _FakeYOLO:
    def __init__(self, path):
        self.path = path

    def __call__(self, image_path, verbose=False):
        raise RuntimeError("Not monkeypatched for this test - use patch.object(api_main, 'model', ...)")


sys.modules.setdefault("ultralytics", SimpleNamespace(YOLO=_FakeYOLO))

import api_main  # noqa: E402  (must import after stubbing ultralytics)
from fastapi.testclient import TestClient  # noqa: E402

client = TestClient(api_main.app)


def _fake_result(class_name, confidence):
    """Builds a fake YOLO classification result matching results[0].probs.*"""
    probs = SimpleNamespace(
        top1conf=SimpleNamespace(item=lambda: confidence),
        top1=0,
    )
    return [SimpleNamespace(probs=probs, names={0: class_name})]


class TestClassifyImageContract:
    """Tests classify_image() directly - no HTTP, no temp files."""

    def test_low_confidence_is_returned_raw_not_overridden(self):
        """
        The whole point of the change: a low-confidence detection must
        NOT be silently turned into an 'uncertain' status by us.
        Person 3 decides that with their own 0.90 cutoff.
        """
        with patch.object(api_main, "looks_like_plant", return_value=(True, 0.5)):
            with patch.object(api_main, "model", return_value=_fake_result("corn_blight", 0.12)):
                result = api_main.classify_image("fake_path.jpg", "corn")

        assert result["confidence"] == 0.12
        assert "status" not in result
        assert result["disease"] == "corn_blight"
        assert result["is_plant"] is True
        assert result["supported_crop"] is True
        assert result["crop_match"] is True

    def test_no_status_field_anywhere_in_contract(self):
        with patch.object(api_main, "looks_like_plant", return_value=(True, 0.5)):
            with patch.object(api_main, "model", return_value=_fake_result("cotton_healthy", 0.97)):
                result = api_main.classify_image("fake_path.jpg", "cotton")

        assert "status" not in result
        assert set(result.keys()) == {
            "disease", "confidence", "is_plant", "supported_crop",
            "crop_match", "crop", "model_version",
        }

    def test_non_plant_image_flagged_but_confidence_still_present(self):
        with patch.object(api_main, "looks_like_plant", return_value=(False, 0.02)):
            result = api_main.classify_image("fake_path.jpg", "corn")

        assert result["is_plant"] is False
        assert result["supported_crop"] is None
        assert result["crop_match"] is None
        assert result["confidence"] == 0.02
        assert "status" not in result

    def test_unsupported_crop_flagged(self):
        with patch.object(api_main, "looks_like_plant", return_value=(True, 0.5)):
            with patch.object(api_main, "model", return_value=_fake_result("Other_Crop", 0.8)):
                result = api_main.classify_image("fake_path.jpg", "wheat")

        assert result["supported_crop"] is False
        assert result["crop_match"] is None
        assert result["confidence"] == 0.8

    def test_crop_mismatch_flagged_not_forced_uncertain(self):
        """Old code forced status='uncertain' on mismatch. New code just
        reports the mismatch as a flag and leaves routing to Person 3."""
        with patch.object(api_main, "looks_like_plant", return_value=(True, 0.5)):
            with patch.object(api_main, "model", return_value=_fake_result("cotton_blight", 0.93)):
                result = api_main.classify_image("fake_path.jpg", "corn")

        assert result["crop_match"] is False
        assert result["confidence"] == 0.93  # unchanged despite the mismatch
        assert "status" not in result

    def test_soyabean_spelling_normalizes_to_soybean(self):
        with patch.object(api_main, "looks_like_plant", return_value=(True, 0.5)):
            with patch.object(api_main, "model", return_value=_fake_result("soybean_rust", 0.88)):
                result = api_main.classify_image("fake_path.jpg", "soyabean")

        assert result["crop_match"] is True


class TestPredictEndpointContract:
    """Tests the actual HTTP /predict route Person 3 will call."""

    def test_predict_endpoint_response_shape(self, tmp_path):
        fake_image = tmp_path / "test.jpg"
        fake_image.write_bytes(b"not a real image, just bytes for the upload")

        with patch.object(api_main, "classify_image") as mock_classify:
            mock_classify.return_value = {
                "disease": "corn_blight",
                "confidence": 0.42,
                "is_plant": True,
                "supported_crop": True,
                "crop_match": True,
                "crop": "corn",
                "model_version": "v2.0",
            }
            with open(fake_image, "rb") as f:
                response = client.post(
                    "/predict",
                    files={"image": ("test.jpg", f, "image/jpeg")},
                    data={"crop": "corn"},
                )

        assert response.status_code == 200
        body = response.json()
        assert "status" not in body
        assert body["confidence"] == 0.42
        assert body["crop_match"] is True

    def test_health_check(self):
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["model_version"] == "v2.0"


if __name__ == "__main__":
    sys.exit(pytest.main([__file__, "-v"]))