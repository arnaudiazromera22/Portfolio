import os
from PIL import Image, ImageEnhance, ImageFilter

input_path = "assets/arnau.jpg"
output_path = "assets/arnau_enhanced.jpg"

if os.path.exists(input_path):
    try:
        img = Image.open(input_path)
        
        # Apply a slight Unsharp Mask filter
        # Radius, Percent, Threshold
        sharpened = img.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))
        
        # Increase contrast slightly
        enhancer = ImageEnhance.Contrast(sharpened)
        enhanced_img = enhancer.enhance(1.1)
        
        enhanced_img.save(output_path, quality=95)
        print(f"Saved enhanced image to {output_path}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("Image not found")
