"""
CropShield AI - Dataset Merge Script
Copies new images from the identified source datasets into your
existing data/processed/train and data/processed/val folders,
matched to your 8 existing classes.

Design choices:
  - Random sample selection (not just "first N files") for representativeness
  - Per-source caps to avoid any one class overshooting the others
  - 80/20 train/val split applied to newly added images, same as your
    existing dataset
  - Filenames prefixed with a source tag so nothing overwrites your
    existing images

Run from: D:\\AGRI_RAKSHAK\\ai-detection
Usage: python merge_datasets.py
"""

import os
import random
import shutil

RAW_ROOT = "data/raw"
PROCESSED_ROOT = "data/processed"
TRAIN_SPLIT = 0.8  # 80% train, 20% val - matches your existing dataset

random.seed(42)  # reproducible sampling

# --------------------------------------------------
# Source -> target mapping
# Each entry: (source_folder, target_class, max_images_to_add, tag)
# max_images_to_add = None means "add everything found"
# --------------------------------------------------

MERGE_PLAN = [
    # Corn
    (r"17C67DHC\dataset\plant data\Corn Common rust", "Corn_Common_Rust", None, "c67"),
    (r"17C67DHC\dataset\plant data\Corn Healthy", "Corn_Healthy", None, "c67"),

    # Cotton
    (r"17C67DHC\dataset\plant data\Cotton Bacterial Blight", "Cotton_Bacterial_Blight", None, "c67"),
    (r"17C67DHC\dataset\plant data\Cotton Healthy Leaf", "Cotton_Healthy", None, "c67"),

    # Soybean
    (r"17C67DHC\dataset\plant data\Soyabean Caterpillar", "Soyabean_Caterpillar", 500, "c67"),  # capped!
    (r"17C67DHC\dataset\plant data\Soyabean Healthy", "Soyabean_Healthy", None, "c67"),

    # Sugarcane Healthy - your weakest class, pulling from 3 sources
    (r"17C67DHC\dataset\plant data\Sugarcane Healthy Leaves", "Sugarcane_Healthy", None, "c67"),
    (r"archive (1)\Healthy", "Sugarcane_Healthy", None, "a1"),
    (r"archive (2)\sugarcane_clean\healthy\healthy", "Sugarcane_Healthy", None, "a2"),

    # Sugarcane Red Rot
    (r"17C67DHC\dataset\plant data\Sugarcane Red Rot", "Sugarcane_Red_Rot", None, "c67"),
    (r"archive (1)\RedRot", "Sugarcane_Red_Rot", None, "a1"),
    (r"archive (2)\sugarcane_clean\red_rot\red_rot", "Sugarcane_Red_Rot", None, "a2"),
]

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")


def get_image_files(folder):
    if not os.path.exists(folder):
        return []
    return [f for f in os.listdir(folder) if f.lower().endswith(IMAGE_EXTENSIONS)]


def merge_one_source(source_folder, target_class, max_images, tag):
    full_source = os.path.join(RAW_ROOT, source_folder)
    images = get_image_files(full_source)

    if not images:
        print(f"  SKIP (no images found): {full_source}")
        return 0, 0

    if max_images is not None and len(images) > max_images:
        images = random.sample(images, max_images)

    random.shuffle(images)
    split_point = int(len(images) * TRAIN_SPLIT)
    train_images = images[:split_point]
    val_images = images[split_point:]

    train_dest = os.path.join(PROCESSED_ROOT, "train", target_class)
    val_dest = os.path.join(PROCESSED_ROOT, "val", target_class)
    os.makedirs(train_dest, exist_ok=True)
    os.makedirs(val_dest, exist_ok=True)

    for img in train_images:
        src = os.path.join(full_source, img)
        dst = os.path.join(train_dest, f"{tag}_{img}")
        shutil.copy2(src, dst)

    for img in val_images:
        src = os.path.join(full_source, img)
        dst = os.path.join(val_dest, f"{tag}_{img}")
        shutil.copy2(src, dst)

    return len(train_images), len(val_images)


def main():
    print("=" * 60)
    print("CropShield AI - Dataset Merge")
    print("=" * 60)

    class_totals = {}

    for source_folder, target_class, max_images, tag in MERGE_PLAN:
        print(f"\nMerging: {source_folder}")
        print(f"  -> {target_class} (cap: {max_images if max_images else 'none'})")

        n_train, n_val = merge_one_source(source_folder, target_class, max_images, tag)
        print(f"  Added {n_train} train + {n_val} val images")

        if target_class not in class_totals:
            class_totals[target_class] = 0
        class_totals[target_class] += (n_train + n_val)

    print("\n" + "=" * 60)
    print("MERGE SUMMARY - new images added per class")
    print("=" * 60)
    for class_name, count in sorted(class_totals.items()):
        print(f"  {class_name:<30} +{count}")

    print("\nDone. Now re-run dataset_check.py to see updated class distribution.")
    print("=" * 60)


if __name__ == "__main__":
    main()