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

MODEL_PATH = "models/best.pt"
MODEL_VERSION = "v1.0"

# Thresholds - tune these after testing on real (non-dataset) photos
THRESHOLD_HIGH = 0.75   # at/above this -> confident detection
THRESHOLD_LOW = 0.45    # below this -> uncertain, needs human review
                        # between the two -> still shown, but a borderline case

model = YOLO(MODEL_PATH)


def classify_image(image_path, crop_name):
    """
    Takes an image path and the crop name (as provided by the farmer app
    or backend), returns the exact JSON shape needed for the API.
    """
    results = model(image_path, verbose=False)
    top1_conf = results[0].probs.top1conf.item()
    top1_class = results[0].names[results[0].probs.top1]

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