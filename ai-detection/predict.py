"""
CropShield AI - Person 1 AI Inference Logic
Matches the team's actual API contract (confirmed with teammate):

    {
      "disease": "Early Blight",
      "confidence": 0.91,
      "status": "Disease Detected" | "Healthy"
    }

IMPORTANT: Per the contract, ROUTING is Person 3's job, not ours:
    confidence >= 0.90  -> routed to farmer
    confidence <  0.90  -> routed to officer

Our job is just to return an accurate disease + confidence. We do NOT
invent our own "uncertain" status field - Person 3's backend decides
what to do based on the confidence number alone.

However, we still use our safety checks (non-plant photos, out-of-scope
crops, crop mismatch) internally - when one of these fires, we
deliberately report a LOW confidence so Person 3's existing <0.90 rule
naturally routes it to an officer for review, without needing any
extra fields or logic on their end.
"""

from ultralytics import YOLO
import cv2
import numpy as np

MODEL_PATH = "models/best.pt"

THRESHOLD_ROUTE = 0.90  # matches the contract's farmer/officer routing cutoff
                        # (informational only on our side - Person 3 applies this)

MIN_GREEN_RATIO = 0.08  # if less than 8% of the image looks plant-colored,
                        # it's probably not a leaf photo at all

# Confidence forced onto cases we know are unreliable, so Person 3's
# existing <0.90 rule automatically sends them to officer review
LOW_CONFIDENCE_OVERRIDE = 0.10

model = YOLO(MODEL_PATH)


def looks_like_plant(image_path):
    """
    Quick heuristic pre-filter (no ML, just color analysis) to catch
    obvious non-plant photos before wasting a model prediction on them.
    """
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
    Takes an image path and (optionally) the crop name the farmer
    selected. Returns the exact JSON shape from the team's API contract.

    Core rule: only returns an actual disease prediction when BOTH:
      - is_plant  = True  (image passes the plant-color check)
      - crop_match = True  (predicted crop matches farmer's stated crop,
                             or no crop_name was given at all)
    If EITHER is False, we return a plain message instead of a disease
    name - never a confident-looking wrong answer.
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

    # Model itself flags this as an out-of-scope crop - treat as a plant
    # check failure too (it IS a plant, just not one we support)
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
    status = "Healthy" if "healthy" in top1_class.lower() else "Disease Detected"

    return {
        "disease": top1_class,
        "confidence": round(top1_conf, 2),
        "status": status,
    }


if __name__ == "__main__":
    # Quick manual test - replace with a real image path
    test_image = "test_corn.jpg"
    result = classify_image(test_image, crop_name="corn")
    print(result)