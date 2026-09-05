import cv2
import os
import random
import math

DATASET_DIR = r"data\processed\train"

# Our 8 classes
classes = [
    "Corn_Common_Rust",
    "Corn_Healthy",
    "Cotton_Bacterial_Blight",
    "Cotton_Healthy",
    "Soyabean_Caterpillar",
    "Soyabean_Healthy",
    "Sugarcane_Red_Rot",
    "Sugarcane_Healthy",
]

# Image size for each grid cell
IMAGE_WIDTH = 350
IMAGE_HEIGHT = 300

images = []

for class_name in classes:

    class_path = os.path.join(DATASET_DIR, class_name)

    # Find images
    files = [
        f for f in os.listdir(class_path)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    if not files:
        print(f"WARNING: No images found for {class_name}")
        continue

    # Pick random image
    selected_file = random.choice(files)
    image_path = os.path.join(class_path, selected_file)

    image = cv2.imread(image_path)

    if image is None:
        print(f"WARNING: Could not read {image_path}")
        continue

    # Resize image
    image = cv2.resize(image, (IMAGE_WIDTH, IMAGE_HEIGHT))

    # Add class name
    label = class_name.replace("_", " ")

    cv2.putText(
        image,
        label,
        (10, 25),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (255, 255, 255),
        2
    )

    images.append((class_name, image))

# Create 2 x 4 grid
rows = 2
cols = 4

grid_rows = []

for r in range(rows):
    row_images = []

    for c in range(cols):
        index = r * cols + c

        if index < len(images):
            row_images.append(images[index][1])
        else:
            row_images.append(
                255 * __import__("numpy").ones(
                    (IMAGE_HEIGHT, IMAGE_WIDTH, 3),
                    dtype="uint8"
                )
            )

    grid_rows.append(cv2.hconcat(row_images))

grid = cv2.vconcat(grid_rows)

# Display
cv2.imshow("CropShield AI - Dataset Viewer", grid)

print("Dataset viewer opened.")
print("Press any key inside the image window to close.")

cv2.waitKey(0)
cv2.destroyAllWindows()