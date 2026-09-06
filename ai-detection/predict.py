"""
CropShield AI - Day 8: Confidence Thresholding & Status Logic
Person 1 - AI Disease & Pest Detection

Implements the exact output shape required by your team's API contract:
    {
      "disease": "Early Blight",
      "confidence": 0.91,
      "status": "detected" | "healthy" | "uncertain",
      "crop": "tomato",
      "model_version": "v1.0"
    }

Thresholds are chosen based on your Day 7 per-class results (all classes
92.8%+ accurate), so we can afford a reasonably high bar for "confident"
without losing too many correct predictions to "uncertain".
"""

from ultralytics import YOLO
import cv2
import numpy as np

MODEL_PATH = "models/best.pt"
MODEL_VERSION = "v1.0"

# Thresholds - tune these after testing on real (non-dataset) photos
THRESHOLD_HIGH = 0.75   # at/above this -> confident detection
THRESHOLD_LOW = 0.45    # below this -> uncertain, needs human review
                        # between the two -> still shown, but a borderline case

MIN_GREEN_RATIO = 0.08  # if less than 8% of the image looks plant-colored,
                        # it's probably not a leaf photo at all

model = YOLO(MODEL_PATH)


def looks_like_plant(image_path):
    """
    Quick heuristic pre-filter (no ML, just color analysis) to catch
    obvious non-plant photos before wasting a model prediction on them.
    Checks what fraction of the image falls in a green/leaf-like color
    range (covers healthy green AND many disease colors - brown spots,
    yellowing, rust - since we're checking broadly, not just healthy-green).
    """
    img = cv2.imread(image_path)
    if img is None:
        return False, 0.0

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Broad range covering green (healthy) through yellow-brown (diseased/dried)
    # Hue: ~15-95 covers yellow through green in OpenCV's 0-180 hue scale
    lower = np.array([15, 30, 30])
    upper = np.array([95, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)

    plant_ratio = np.count_nonzero(mask) / mask.size
    return plant_ratio >= MIN_GREEN_RATIO, plant_ratio


def classify_image(image_path, crop_name):
    """
    Takes an image path and the crop name (as provided by the farmer app
    or backend), returns the exact JSON shape needed for the API.
    """
    # Pre-filter: does this even look like a plant photo?
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

    # NEW: if the model itself predicts "Other_Crop" (a crop outside our
    # 4 supported ones), that's a genuine learned signal - no need for
    # threshold or crop-matching logic, just report it directly.
    if top1_class == "Other_Crop":
        return {
            "disease": "Not one of the supported crops (corn, cotton, soybean, sugarcane)",
            "confidence": round(top1_conf, 2),
            "status": "uncertain",
            "crop": crop_name,
            "model_version": MODEL_VERSION,
        }

    # Determine status
    if "healthy" in top1_class.lower():
        status = "healthy"
    elif top1_conf < THRESHOLD_LOW:
        status = "uncertain"
    else:
        status = "detected"  # covers both high and medium confidence for now

    # Safeguard: our model only knows 8 classes across 4 crops. If the
    # farmer-specified crop doesn't match the predicted class's crop prefix,
    # the model is confidently guessing on something outside its scope
    # (e.g. a tomato leaf gets forced into one of our known classes).
    # Override to "uncertain" regardless of confidence in this case.
    predicted_crop = top1_class.split("_")[0]  # e.g. "Corn", "Cotton", "Soyabean", "Sugarcane"
    crop_name_normalized = crop_name.strip().lower()
    predicted_crop_normalized = predicted_crop.lower().replace("soyabean", "soybean")

    if crop_name_normalized.replace("soyabean", "soybean") != predicted_crop_normalized:
        status = "uncertain"

    return {
        "disease": top1_class,
        "confidence": round(top1_conf, 2),
        "status": status,
        "crop": crop_name,
        "model_version": MODEL_VERSION,
    }


if __name__ == "__main__":
    # Quick manual test - replace with a real image path from your val set
    # or better, a photo you take yourself that's NOT in the training data
    test_image = "test_corn.jpg"  # example - update this path
    result = classify_image(test_image, crop_name="corn")
    print(result)