import os
import shutil
from PIL import Image

pic_dir = r"c:\Users\DHRUV GUPTA\OneDrive\Desktop\ludo\src\pic"
scam_dir = os.path.join(pic_dir, "scam")
protection_dir = os.path.join(pic_dir, "protection")

os.makedirs(scam_dir, exist_ok=True)
os.makedirs(protection_dir, exist_ok=True)

for filename in os.listdir(pic_dir):
    if filename.endswith(".jpeg") or filename.endswith(".jpg"):
        filepath = os.path.join(pic_dir, filename)
        try:
            img = Image.open(filepath).convert("RGB")
            # Resize for faster processing
            img.thumbnail((100, 100))
            pixels = img.getdata()
            
            red_count = 0
            green_count = 0
            
            for r, g, b in pixels:
                if r > 150 and r > g + 50 and r > b + 50:
                    red_count += 1
                if g > 100 and g > r + 30 and g > b + 30:
                    green_count += 1
                    
            if red_count > green_count:
                print(f"Moving {filename} to SCAM")
                shutil.move(filepath, os.path.join(scam_dir, filename))
            else:
                print(f"Moving {filename} to PROTECTION")
                shutil.move(filepath, os.path.join(protection_dir, filename))
        except Exception as e:
            print(f"Error processing {filename}: {e}")
