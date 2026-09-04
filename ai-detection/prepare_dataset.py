import os
import random
import shutil

BASE = r"data\raw\17C67DHC\dataset\plant data"
OUT = r"data\processed"

classes = {
    "Corn Common rust": "Corn_Common_Rust",
    "Corn Healthy": "Corn_Healthy",
    "Cotton Bacterial Blight": "Cotton_Bacterial_Blight",
    "Cotton Healthy Leaf": "Cotton_Healthy",
    "Soyabean Caterpillar": "Soyabean_Caterpillar",
    "Soyabean Healthy": "Soyabean_Healthy",
    "Sugarcane Red Rot": "Sugarcane_Red_Rot",
    "Sugarcane Healthy Leaves": "Sugarcane_Healthy",
}

random.seed(42)

for source_class, output_class in classes.items():

    source = os.path.join(BASE, source_class)

    if not os.path.exists(source):
        print(f"ERROR: Folder not found: {source}")
        continue

    images = [
        f for f in os.listdir(source)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp"))
    ]

    # Limit Soyabean Caterpillar to 1000 images
    if source_class == "Soyabean Caterpillar" and len(images) > 1000:
        images = random.sample(images, 1000)

    random.shuffle(images)

    split = int(len(images) * 0.8)

    train_images = images[:split]
    val_images = images[split:]

    train_dir = os.path.join(OUT, "train", output_class)
    val_dir = os.path.join(OUT, "val", output_class)

    os.makedirs(train_dir, exist_ok=True)
    os.makedirs(val_dir, exist_ok=True)

    for image in train_images:
        shutil.copy2(
            os.path.join(source, image),
            os.path.join(train_dir, image)
        )

    for image in val_images:
        shutil.copy2(
            os.path.join(source, image),
            os.path.join(val_dir, image)
        )

    print(f"{output_class}: {len(train_images)} train, {len(val_images)} val")

print("\nDataset preparation complete!")