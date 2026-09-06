"""
CropShield AI - Day 9: FastAPI Serving Endpoint
Person 1 - AI Disease & Pest Detection

Wraps the already-tested predict.py logic (confidence thresholding +
crop-mismatch safeguard) in an HTTP API that Person 3's Django backend
can call.

Run from: D:\\AGRI_RAKSHAK\\ai-detection
Usage: uvicorn api_main:app --reload --port 8001

Test it yourself with curl (in a separate terminal, while this is running):
  curl -X POST http://localhost:8001/predict -F "image=@test_corn.jpg" -F "crop=corn"
"""

from fastapi import FastAPI, File, UploadFile, Form
from ultralytics import YOLO
import cv2
import numpy as np
import shutil
import os

app = FastAPI(title="CropShield AI - Disease Detection API")

MODEL_PATH = "models/best.pt"
MODEL_VERSION = "v2.0"  # bumped to v2.0 - now the 9-class model (cropshield_v2)
THRESHOLD_LOW = 0.45
MIN_GREEN_RATIO = 0.08

model = YOLO(MODEL_PATH)


def looks_like_plant(image_path):
    """Quick color-based pre-filter to catch obvious non-plant photos."""
    img = cv2.imread(image_path)
    if img is None:
        return False, 0.0

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    lower = np.array([15, 30, 30])
    upper = np.array([95, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)

    plant_ratio = np.count_nonzero(mask) / mask.size
    return plant_ratio >= MIN_GREEN_RATIO, plant_ratio


def classify_image(image_path, crop_name):
    """Same logic as predict.py, tested and confirmed working."""
    is_plant, green_ratio = looks_like_plant(image_path)
    if not is_plant:
        return {
            "disease": "Not identifiable - image does not appear to be a plant/leaf photo",
            "confidence": round(green_ratio, 2),
            "status": "uncertain",
            "crop": crop_name,
            "model_version": MODEL_VERSION,
        }

    results = model(image_path, verbose=False)
    top1_conf = results[0].probs.top1conf.item()
    top1_class = results[0].names[results[0].probs.top1]

    if top1_class == "Other_Crop":
        return {
            "disease": "Not one of the supported crops (corn, cotton, soybean, sugarcane)",
            "confidence": round(top1_conf, 2),
            "status": "uncertain",
            "crop": crop_name,
            "model_version": MODEL_VERSION,
        }

    if "healthy" in top1_class.lower():
        status = "healthy"
    elif top1_conf < THRESHOLD_LOW:
        status = "uncertain"
    else:
        status = "detected"

    predicted_crop = top1_class.split("_")[0]
    crop_name_normalized = crop_name.strip().lower().replace("soyabean", "soybean")
    predicted_crop_normalized = predicted_crop.lower().replace("soyabean", "soybean")

    if crop_name_normalized != predicted_crop_normalized:
        status = "uncertain"

    return {
        "disease": top1_class,
        "confidence": round(top1_conf, 2),
        "status": status,
        "crop": crop_name,
        "model_version": MODEL_VERSION,
    }


@app.get("/")
async def root():
    """Simple health check - Person 3 can hit this to confirm the API is alive."""
    return {"status": "ok", "service": "CropShield AI Disease Detection", "model_version": MODEL_VERSION}


@app.post("/predict")
async def predict(image: UploadFile = File(...), crop: str = Form(...)):
    # Save uploaded image to a temp file so YOLO/OpenCV can read it
    temp_path = f"temp_{image.filename}"
    try:
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(image.file, f)

        result = classify_image(temp_path, crop)
        return result
    finally:
        # Always clean up the temp file, even if something above fails
        if os.path.exists(temp_path):
            os.remove(temp_path)