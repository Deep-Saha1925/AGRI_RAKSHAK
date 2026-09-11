"""
CropShield AI - YOLOv8 Classification Training Script
Person 1 - AI Disease & Pest Detection

Dataset: 8 classes, ~8,061 images (after merging in extra sugarcane
data from archive (1) and archive (2) to fix the original
Sugarcane_Healthy imbalance)
  - Corn_Common_Rust (646), Corn_Healthy (834)
  - Cotton_Bacterial_Blight (1000), Cotton_Healthy (1000)
  - Soyabean_Caterpillar (1000), Soyabean_Healthy (896)
  - Sugarcane_Healthy (1050), Sugarcane_Red_Rot (1635)

Run this either locally (if you have an NVIDIA GPU) or in Google Colab
(recommended if you don't - just upload data/processed as a zip and
unzip it in the Colab environment first).
"""

from ultralytics import YOLO

# --------------------------------------------------
# Config
# --------------------------------------------------

DATA_DIR = "data/processed"     # must contain train/ and val/ subfolders
EPOCHS = 40                     # a bit higher than the roadmap default (30)
                                 # to give the underrepresented Sugarcane_Healthy
                                 # class more chances to be learned well
IMAGE_SIZE = 224
BATCH_SIZE = 32
MODEL_VARIANT = "yolov8n-cls.pt"  # nano - fast, good for hackathon timeline
                                    # upgrade to yolov8s-cls.pt if accuracy
                                    # is too low and you have time to spare

# --------------------------------------------------
# Train
# --------------------------------------------------

def main():
    model = YOLO(MODEL_VARIANT)

    # NOTE on class balance: Sugarcane_Healthy was originally your weakest
    # class (344 images) but has since been boosted to 1050 via a dataset
    # merge. Sugarcane_Red_Rot is now your largest class (1635). YOLOv8's
    # built-in augmentation (rotation, flip, brightness, mosaic-style crops)
    # helps smaller classes generalize despite the remaining size differences.
    # Check per-class performance in Day 7 evaluation - if Red_Rot's size
    # advantage is biasing predictions, that's the point to address it
    # (e.g. capping how many Red_Rot images are sampled per epoch).

    results = model.train(
        data=DATA_DIR,
        epochs=EPOCHS,
        imgsz=IMAGE_SIZE,
        batch=BATCH_SIZE,
        device=0,          # 0 = first GPU. Change to 'cpu' if no GPU available.
        patience=10,        # stop early if val accuracy stalls for 10 epochs
        project="runs/classify",
        name="cropshield_v1",
        exist_ok=True,
    )

    print("\nTraining complete.")
    print("Best weights saved to: runs/classify/cropshield_v1/weights/best.pt")
    print("Copy that file into models/best.pt for the API step (Day 9).")


if __name__ == "__main__":
    main()