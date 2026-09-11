"""
CropShield AI - Shrink dataset for faster Colab upload
Creates a resized COPY of data/processed at data/processed_small,
capping every image at 300x300 (still plenty for imgsz=224 training,
but a fraction of the file size of your original mixed-resolution
images, some of which are 3000-4000px).

Your original data/processed folder is left untouched.

Run from: D:\\AGRI_RAKSHAK\\ai-detection
Usage: python shrink_for_upload.py
"""

import os
import cv2

SOURCE_ROOT = "data/processed"
DEST_ROOT = "data/processed_small"
MAX_DIM = 300

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")


def resize_keep_aspect(image, max_dim):
    h, w = image.shape[:2]
    if max(h, w) <= max_dim:
        return image  # already small enough
    scale = max_dim / max(h, w)
    new_w, new_h = int(w * scale), int(h * scale)
    return cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)


def main():
    total = 0
    skipped = 0

    for split in ["train", "val"]:
        split_src = os.path.join(SOURCE_ROOT, split)
        if not os.path.exists(split_src):
            continue

        for class_name in sorted(os.listdir(split_src)):
            class_src = os.path.join(split_src, class_name)
            if not os.path.isdir(class_src):
                continue

            class_dest = os.path.join(DEST_ROOT, split, class_name)
            os.makedirs(class_dest, exist_ok=True)

            for filename in os.listdir(class_src):
                if not filename.lower().endswith(IMAGE_EXTENSIONS):
                    continue

                src_path = os.path.join(class_src, filename)
                dest_path = os.path.join(class_dest, filename)

                img = cv2.imread(src_path)
                if img is None:
                    skipped += 1
                    continue

                resized = resize_keep_aspect(img, MAX_DIM)
                # JPEG quality 85 - good balance of size vs quality
                cv2.imwrite(dest_path, resized, [cv2.IMWRITE_JPEG_QUALITY, 85])
                total += 1

            print(f"  {split}/{class_name}: done")

    print(f"\nResized {total} images into {DEST_ROOT}/")
    if skipped:
        print(f"Skipped {skipped} unreadable images.")
    print(f"\nNow zip '{DEST_ROOT}' (not the original data/processed) and upload that instead.")


if __name__ == "__main__":
    main()