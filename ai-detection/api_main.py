"""
CropShield AI - FastAPI Inference Service
Person 1 - AI Disease & Pest Detection

Matches the team's confirmed API contract:
    POST /predict
    Response: {
      "disease": "Early Blight",
      "confidence": 0.91,
      "status": "Disease Detected" | "Healthy"
    }

Person 3's backend owns routing (confidence >= 0.90 -> farmer,
< 0.90 -> officer) - we just provide an honest disease + confidence.

Run from: D:\\AGRI_RAKSHAK\\ai-detection
Usage: uvicorn api_main:app --reload --port 8001

Test with curl (Windows PowerShell - use curl.exe, not curl):
  curl.exe -X POST http://localhost:8001/predict -F "image=@test_corn.jpg" -F "crop=corn"
"""

from fastapi import FastAPI, File, UploadFile, Form
from typing import Optional
from ultralytics import YOLO
import cv2
import numpy as np
import shutil
import os

app = FastAPI(title="CropShield AI - Disease Detection API")

MODEL_PATH = "models/best.pt"
MIN_GREEN_RATIO = 0.08
LOW_CONFIDENCE_OVERRIDE = 0.10  # forces Person 3's <0.90 routing rule to catch unreliable cases

model = YOLO(MODEL_PATH)


def looks_like_plant(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return False, 0.0

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower = np.array([15, 30, 30])
    upper = np.array([95, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)

    plant_ratio = np.count_nonzero(mask) / mask.size
    return plant_ratio >= MIN_GREEN_RATIO, plant_ratio


def classify_image(image_path, crop_name=None):
    """
    Core rule: only returns an actual disease prediction when BOTH:
      - is_plant   = True  (image passes the plant-color check)
      - crop_match = True  (predicted crop matches farmer's stated crop,
                             or no crop_name was given at all)
    If EITHER is False, returns a plain message instead of a disease
    name, with confidence deliberately forced low so Person 3's
    existing >=0.90/<0.90 routing rule automatically sends it to an
    officer for review - no extra fields or logic needed on their end.
    """
    # ---- Check 1: is_plant ----
    is_plant, green_ratio = looks_like_plant(image_path)

    if not is_plant:
        return {
            "disease": "Unable to identify - image does not appear to be a plant/leaf photo",
            "confidence": LOW_CONFIDENCE_OVERRIDE,
            "status": "Disease Detected",
        }

    # Run the model only once we know it's plant-like
    results = model(image_path, verbose=False)
    top1_conf = results[0].probs.top1conf.item()
    top1_class = results[0].names[results[0].probs.top1]

    # Model itself flags this as an out-of-scope crop - it IS a plant,
    # just not one we support, so treat like a failed check too
    if top1_class == "Other_Crop":
        return {
            "disease": "Not one of the supported crops (corn, cotton, soybean, sugarcane)",
            "confidence": LOW_CONFIDENCE_OVERRIDE,
            "status": "Disease Detected",
        }

    # ---- Check 2: crop_match ----
    predicted_crop = top1_class.split("_")[0]
    crop_match = True  # default True if no crop_name was given to check against

    if crop_name:
        crop_name_normalized = crop_name.strip().lower().replace("soyabean", "soybean")
        predicted_crop_normalized = predicted_crop.lower().replace("soyabean", "soybean")
        crop_match = (crop_name_normalized == predicted_crop_normalized)

    if not crop_match:
        return {
            "disease": f"Predicted class ({top1_class}) does not match specified crop ({crop_name})",
            "confidence": LOW_CONFIDENCE_OVERRIDE,
            "status": "Disease Detected",
        }

    # ---- Both checks passed: is_plant=True AND crop_match=True ----
    # Real confidence from the model is returned here - this is what
    # Person 3's backend uses for its own >=0.90/<0.90 routing decision.
    status = "Healthy" if "healthy" in top1_class.lower() else "Disease Detected"

    return {
        "disease": top1_class,
        "confidence": round(top1_conf, 2),
        "status": status,
    }


@app.get("/")
async def root():
    """Health check - Person 3 can hit this to confirm the API is alive."""
    return {"status": "ok", "service": "CropShield AI Disease Detection"}


@app.post("/predict")
async def predict(image: UploadFile = File(...), crop: Optional[str] = Form(None)):
    temp_path = f"temp_{image.filename}"
    try:
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(image.file, f)

        result = classify_image(temp_path, crop)
        return result
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)