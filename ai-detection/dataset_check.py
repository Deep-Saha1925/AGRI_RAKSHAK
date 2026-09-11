import cv2
import os
from collections import Counter, defaultdict

# --------------------------------------------------
# Configuration
# --------------------------------------------------

DATASET_DIR = r"data\processed"

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")

# --------------------------------------------------
# Counters
# --------------------------------------------------

total_images = 0
readable_images = 0
corrupted_images = []

dimensions = Counter()
class_counts = defaultdict(int)

small_images = []
non_color_images = []

# --------------------------------------------------
# Scan dataset
# --------------------------------------------------

print("=" * 60)
print("CropShield AI - Dataset Quality Check")
print("=" * 60)

for split in ["train", "val"]:

    split_path = os.path.join(DATASET_DIR, split)

    if not os.path.exists(split_path):
        print(f"\nWARNING: {split_path} does not exist.")
        continue

    print(f"\nChecking: {split.upper()}")

    for class_name in sorted(os.listdir(split_path)):

        class_path = os.path.join(split_path, class_name)

        if not os.path.isdir(class_path):
            continue

        for filename in os.listdir(class_path):

            if not filename.lower().endswith(IMAGE_EXTENSIONS):
                continue

            image_path = os.path.join(class_path, filename)

            total_images += 1
            class_counts[f"{split}/{class_name}"] += 1

            # Read image using OpenCV
            image = cv2.imread(image_path)

            # Check if image can be read
            if image is None:
                corrupted_images.append(image_path)
                continue

            readable_images += 1

            # Get dimensions
            height, width, channels = image.shape

            dimensions[(width, height)] += 1

            # Check for very small images
            if width < 100 or height < 100:
                small_images.append(
                    (image_path, width, height)
                )

            # OpenCV normally loads color images with 3 channels
            if channels != 3:
                non_color_images.append(
                    (image_path, channels)
                )

# --------------------------------------------------
# Results
# --------------------------------------------------

print("\n" + "=" * 60)
print("DATASET SUMMARY")
print("=" * 60)

print(f"Total images       : {total_images}")
print(f"Readable images    : {readable_images}")
print(f"Corrupted images   : {len(corrupted_images)}")
print(f"Very small images  : {len(small_images)}")
print(f"Non-color images   : {len(non_color_images)}")

# --------------------------------------------------
# Class distribution
# --------------------------------------------------

print("\n" + "=" * 60)
print("CLASS DISTRIBUTION")
print("=" * 60)

for class_name in sorted(class_counts):
    print(f"{class_name:<45} {class_counts[class_name]}")

# --------------------------------------------------
# Image dimensions
# --------------------------------------------------

print("\n" + "=" * 60)
print("IMAGE DIMENSIONS")
print("=" * 60)

for (width, height), count in dimensions.most_common():
    print(f"{width} x {height:<8} : {count}")

# --------------------------------------------------
# Corrupted images
# --------------------------------------------------

if corrupted_images:

    print("\n" + "=" * 60)
    print("CORRUPTED / UNREADABLE IMAGES")
    print("=" * 60)

    for image_path in corrupted_images:
        print(image_path)

else:

    print("\nNo corrupted or unreadable images found. ✅")

# --------------------------------------------------
# Small images
# --------------------------------------------------

if small_images:

    print("\n" + "=" * 60)
    print("VERY SMALL IMAGES")
    print("=" * 60)

    for image_path, width, height in small_images:
        print(f"{width}x{height} - {image_path}")

else:

    print("\nNo very small images found. ✅")

# --------------------------------------------------
# Non-color images
# --------------------------------------------------

if non_color_images:

    print("\n" + "=" * 60)
    print("NON-3-CHANNEL IMAGES")
    print("=" * 60)

    for image_path, channels in non_color_images:
        print(f"{channels} channels - {image_path}")

else:

    print("\nAll images have 3 color channels. ✅")

# --------------------------------------------------
# Final status
# --------------------------------------------------

print("\n" + "=" * 60)
print("FINAL STATUS")
print("=" * 60)

if len(corrupted_images) == 0:
    print("Image integrity: PASS ✅")
else:
    print("Image integrity: CHECK REQUIRED ❌")

if len(small_images) == 0:
    print("Image size:      PASS ✅")
else:
    print("Image size:      CHECK REQUIRED ⚠️")

if len(non_color_images) == 0:
    print("Color channels:  PASS ✅")
else:
    print("Color channels:  CHECK REQUIRED ⚠️")

print("=" * 60)