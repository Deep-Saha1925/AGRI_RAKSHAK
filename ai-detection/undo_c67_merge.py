"""
CropShield AI - Undo Duplicate Merge
Removes only the images added with the "c67_" prefix (from the
17C67DHC merge, which turned out to be duplicate data from the
same source as your original dataset).

Keeps the "a1_" and "a2_" prefixed images (archive (1) and
archive (2)) since those are genuinely new, different-source data.

Run from: D:\\AGRI_RAKSHAK\\ai-detection
Usage: python undo_c67_merge.py
"""

import os

PROCESSED_ROOT = "data/processed"
PREFIX_TO_REMOVE = "c67_"


def main():
    removed_count = 0
    kept_examples = []

    for split in ["train", "val"]:
        split_path = os.path.join(PROCESSED_ROOT, split)
        if not os.path.exists(split_path):
            continue

        for class_name in sorted(os.listdir(split_path)):
            class_path = os.path.join(split_path, class_name)
            if not os.path.isdir(class_path):
                continue

            for filename in os.listdir(class_path):
                if filename.startswith(PREFIX_TO_REMOVE):
                    os.remove(os.path.join(class_path, filename))
                    removed_count += 1
                elif filename.startswith("a1_") or filename.startswith("a2_"):
                    if len(kept_examples) < 5:
                        kept_examples.append(f"{split}/{class_name}/{filename}")

    print(f"Removed {removed_count} duplicate images (c67_ prefix).")
    print(f"\nKept genuinely new images, e.g.:")
    for ex in kept_examples:
        print(f"  {ex}")
    print("\nNow re-run dataset_check.py to confirm final class distribution.")


if __name__ == "__main__":
    main()