"""
CropShield AI - Add "Other_Crop" negative class
Uses the tomato/potato/pepper images already sitting in your
plantdisease folder (previously unused) to teach the model to
recognize photos that AREN'T one of your 4 supported crops
(corn, cotton, soybean, sugarcane).

This creates a 9th class: Other_Crop
After running this, retrain using train.py (just update it to point
at data/processed - the new class folder will be picked up
automatically since YOLO reads class names from folder names).

Run from: D:\\AGRI_RAKSHAK\\ai-detection
Usage: python add_other_crop_class.py
"""

import os
import random
import shutil

RAW_ROOT = "data/raw"
PROCESSED_ROOT = "data/processed"
TRAIN_SPLIT = 0.8
TARGET_CLASS = "Other_Crop"
MAX_PER_SOURCE = 400  # cap each source folder so no single crop dominates "Other_Crop"

random.seed(42)

# Source folders to pull from - all clearly NOT your 4 supported crops
SOURCES = [
    (r"plantdisease\PlantVillage\PlantVillage\Tomato_healthy", "pd_tom_h"),
    (r"plantdisease\PlantVillage\PlantVillage\Tomato_Early_blight", "pd_tom_eb"),
    (r"plantdisease\PlantVillage\PlantVillage\Tomato_Late_blight", "pd_tom_lb"),
    (r"plantdisease\PlantVillage\PlantVillage\Potato___healthy", "pd_pot_h"),
    (r"plantdisease\PlantVillage\PlantVillage\Potato___Early_blight", "pd_pot_eb"),
    (r"plantdisease\PlantVillage\PlantVillage\Pepper__bell___healthy", "pd_pep_h"),
    (r"plantdisease\PlantVillage\PlantVillage\Pepper__bell___Bacterial_spot", "pd_pep_bs"),
]

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")


def get_image_files(folder):
    if not os.path.exists(folder):
        print(f"  NOT FOUND: {folder}")
        return []
    return [f for f in os.listdir(folder) if f.lower().endswith(IMAGE_EXTENSIONS)]


def main():
    total_train, total_val = 0, 0

    for source_folder, tag in SOURCES:
        full_source = os.path.join(RAW_ROOT, source_folder)
        images = get_image_files(full_source)

        if not images:
            continue

        if len(images) > MAX_PER_SOURCE:
            images = random.sample(images, MAX_PER_SOURCE)

        random.shuffle(images)
        split_point = int(len(images) * TRAIN_SPLIT)
        train_images = images[:split_point]
        val_images = images[split_point:]

        train_dest = os.path.join(PROCESSED_ROOT, "train", TARGET_CLASS)
        val_dest = os.path.join(PROCESSED_ROOT, "val", TARGET_CLASS)
        os.makedirs(train_dest, exist_ok=True)
        os.makedirs(val_dest, exist_ok=True)

        for img in train_images:
            shutil.copy2(os.path.join(full_source, img), os.path.join(train_dest, f"{tag}_{img}"))
        for img in val_images:
            shutil.copy2(os.path.join(full_source, img), os.path.join(val_dest, f"{tag}_{img}"))

        print(f"{source_folder}: added {len(train_images)} train + {len(val_images)} val")
        total_train += len(train_images)
        total_val += len(val_images)

    print(f"\nTotal Other_Crop images added: {total_train} train + {total_val} val")
    print("Now re-run train.py to retrain with 9 classes (8 original + Other_Crop).")


if __name__ == "__main__":
    main()