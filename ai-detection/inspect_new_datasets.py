"""
CropShield AI - Dataset Inspector
Run this once to see the folder structure of all newly downloaded
datasets before merging them into your existing data/processed set.

This version:
  1. Auto-extracts any .zip file sitting directly in data/raw/
     (skips ones already extracted - checks if a matching folder exists)
  2. Then inspects every folder in data/raw/ and prints its structure
     so you can identify which is which by the class names inside.

Usage:
  1. Just run: python inspect_new_datasets.py
  2. Paste the full output back - each section will show the class
     folder names and image counts inside, which is enough to identify
     "oh, this one is the cotton dataset" etc.
"""

import os
import zipfile

RAW_DATA_ROOT = "data/raw"


def extract_zips(root):
    """Extract any .zip file in root into a same-named folder, if not already done."""
    if not os.path.exists(root):
        print(f"'{root}' does not exist - check you're running this from")
        print("inside the ai-detection folder.")
        return

    zip_files = [f for f in os.listdir(root) if f.lower().endswith(".zip")]

    for zip_name in zip_files:
        zip_path = os.path.join(root, zip_name)
        folder_name = os.path.splitext(zip_name)[0]
        dest_path = os.path.join(root, folder_name)

        if os.path.exists(dest_path):
            print(f"Skipping {zip_name} - '{folder_name}/' already exists")
            continue

        print(f"Extracting {zip_name} -> {folder_name}/  (this may take a minute for large files)")
        try:
            with zipfile.ZipFile(zip_path, "r") as zf:
                zf.extractall(dest_path)
        except zipfile.BadZipFile:
            print(f"  WARNING: {zip_name} could not be read as a zip (corrupted download?)")


def inspect_folder(root, max_depth=3):
    for current_root, dirs, files in os.walk(root):
        depth = current_root[len(root):].count(os.sep)
        if depth > max_depth:
            dirs[:] = []
            continue

        indent = "  " * depth
        folder_name = os.path.basename(current_root) or current_root
        image_count = sum(1 for f in files if f.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp")))

        if image_count > 0:
            print(f"{indent}{folder_name}/  -> {image_count} images")
        else:
            print(f"{indent}{folder_name}/")


def main():
    print("=" * 60)
    print("New Dataset Folder Inspector (auto-extract + auto-detect)")
    print("=" * 60)

    print("\nStep 1: Extracting any zip files found...\n")
    extract_zips(RAW_DATA_ROOT)

    print("\nStep 2: Inspecting all folders...\n")

    all_entries = sorted(os.listdir(RAW_DATA_ROOT))
    folders = [e for e in all_entries if os.path.isdir(os.path.join(RAW_DATA_ROOT, e))]

    if not folders:
        print("No folders found to inspect.")
        return

    for folder_name in folders:
        full_path = os.path.join(RAW_DATA_ROOT, folder_name)
        print(f"\n--- {full_path} ---")
        inspect_folder(full_path)

    print("\n" + "=" * 60)
    print("Copy this whole output and share it - based on the class")
    print("names shown, I'll tell you which folder is which dataset")
    print("and give you the exact rename/merge commands.")
    print("=" * 60)


if __name__ == "__main__":
    main()