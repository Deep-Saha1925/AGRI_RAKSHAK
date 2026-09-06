"""
CropShield AI - Day 7: Per-Class Evaluation
Checks accuracy broken down by class, not just the overall 98.3%,
to confirm no single class (especially Sugarcane_Red_Rot, your
largest class, or Sugarcane_Healthy, your once-weakest class) is
hiding a problem behind the strong overall number.

Run from: D:\\AGRI_RAKSHAK\\ai-detection
Usage: python evaluate.py
"""

from ultralytics import YOLO
import os

MODEL_PATH = "models/best.pt"
VAL_DIR = "data/processed_small/val"  # or data/processed/val if you kept full-res val images


def main():
    model = YOLO(MODEL_PATH)

    print("=" * 60)
    print("Overall validation metrics")
    print("=" * 60)
    metrics = model.val(data="data/processed_small")
    print(f"Top-1 accuracy: {metrics.top1:.3f}")
    print(f"Top-5 accuracy: {metrics.top5:.3f}")

    print("\n" + "=" * 60)
    print("Per-class breakdown (manual pass over val folders)")
    print("=" * 60)

    class_names = sorted(os.listdir(VAL_DIR))

    for class_name in class_names:
        class_path = os.path.join(VAL_DIR, class_name)
        if not os.path.isdir(class_path):
            continue

        images = [f for f in os.listdir(class_path)
                  if f.lower().endswith((".jpg", ".jpeg", ".png"))]

        correct = 0
        total = len(images)

        for img_file in images:
            img_path = os.path.join(class_path, img_file)
            results = model(img_path, verbose=False)
            predicted_class = results[0].names[results[0].probs.top1]

            if predicted_class == class_name:
                correct += 1

        accuracy = correct / total if total > 0 else 0
        flag = "  <-- check this one" if accuracy < 0.90 else ""
        print(f"{class_name:<30} {correct}/{total}  ({accuracy:.1%}){flag}")


if __name__ == "__main__":
    main()