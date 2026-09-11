import os
import random
import cv2
import matplotlib.pyplot as plt

# ==============================
# CropShield AI
# Visual Dataset Inspection
# ==============================

DATASET_PATH = "dataset"

TRAIN_PATH = os.path.join(DATASET_PATH, "train")

classes = [
    "Corn_Common_Rust",
    "Corn_Healthy",
    "Cotton_Bacterial_Blight",
    "Cotton_Healthy",
    "Soyabean_Caterpillar",
    "Soyabean_Healthy",
    "Sugarcane_Healthy",
    "Sugarcane_Red_Rot"
]

print("=" * 60)
print("CropShield AI - Visual Dataset Inspection")
print("=" * 60)

for class_name in classes:

    class_path = os.path.join(TRAIN_PATH, class_name)

    if not os.path.exists(class_path):
        print(f"\n❌ Folder not found: {class_path}")
        continue

    images = [
        f for f in os.listdir(class_path)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp"))
    ]

    if not images:
        print(f"\n⚠️ No images found: {class_name}")
        continue

    # Select up to 5 random images
    selected = random.sample(images, min(5, len(images)))

    print(f"\n{class_name}")
    print(f"Total images: {len(images)}")

    fig, axes = plt.subplots(1, len(selected), figsize=(15, 4))

    if len(selected) == 1:
        axes = [axes]

    for ax, filename in zip(axes, selected):

        image_path = os.path.join(class_path, filename)

        image = cv2.imread(image_path)

        if image is None:
            ax.set_title("Unreadable")
            ax.axis("off")
            continue

        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        ax.imshow(image)
        ax.set_title(filename[:18])
        ax.axis("off")

    plt.suptitle(class_name, fontsize=14)
    plt.tight_layout()
    plt.show()

print("\n" + "=" * 60)
print("Visual inspection completed.")
print("=" * 60)