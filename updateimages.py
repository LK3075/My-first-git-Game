import json
import os

# === SETTINGS ===
json_file = "web/StatList.json"       # Path to your JSON file
images_folder = "web/images"          # Folder containing all station images
extensions = [".jpg", ".jpeg", ".png"]  # Allowed image file types

# === Load JSON ===
with open(json_file, "r", encoding="utf-8") as f:
    stations = json.load(f)

# === Update each station ===
for station in stations:
    station_name = station["name"]  # keep spaces intact
    found_image = ""

    # Check for matching file in images folder
    for ext in extensions:
        path = f"{images_folder}/{station_name}{ext}"
        if os.path.exists(path):
            # Use path **relative to HTML file**, drop the "web/" prefix
            found_image = f"images/{station_name}{ext}"
            break

    station["image"] = found_image  # "" if no image found

# === Save updated JSON ===
with open(json_file, "w", encoding="utf-8") as f:
    json.dump(stations, f, indent=4)

print(f"Updated image paths for {len(stations)} stations!")
