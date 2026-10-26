"""
Universal Cross-Platform Asset Generator
Runs identically on Windows, macOS, and Linux.

Requirements:
    pip install pillow

Usage:
    python scripts/generate_assets.py
"""

import os
import re
import json
import urllib.request
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# 1. Paths & Environment Setup
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
APP_DIR = os.path.join(PROJECT_DIR, "app")
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")
ENV_PATH = os.path.join(PROJECT_DIR, ".env.local")

supabase_url = ""
supabase_key = ""

if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
                supabase_url = line.split("=", 1)[1].strip()
            elif line.startswith("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=") or line.startswith("NEXT_PUBLIC_SUPABASE_ANON_KEY="):
                supabase_key = line.split("=", 1)[1].strip()

# 2. Fetch Profile Info from Supabase (using standard library)
name = "Md Shahidullah"
bio = "Full-Stack Developer (Python, Django & React)"
avatar_url = ""

if supabase_url and supabase_key:
    try:
        req_url = f"{supabase_url}/rest/v1/profiles?select=name,bio,avatar_url&order=created_at.desc&limit=1"
        req = urllib.request.Request(req_url, headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}"
        })
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if res_data:
                data = res_data[0]
                if data.get("name"):
                    name = data.get("name")
                if data.get("bio"):
                    bio = data.get("bio")
                if data.get("avatar_url"):
                    avatar_url = data.get("avatar_url")
    except Exception:
        # Offline or sandbox mode fallback
        pass

# 3. Load Avatar Image (From Supabase URL or local Archive)
avatar_img = None
if avatar_url and avatar_url.startswith("http"):
    try:
        req_img = urllib.request.Request(avatar_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req_img, timeout=5) as img_res:
            avatar_img = Image.open(BytesIO(img_res.read())).convert("RGBA")
    except Exception:
        pass

if not avatar_img:
    local_avatar = os.path.join(PROJECT_DIR, "..", "Archive", "Profile.jpg")
    if os.path.exists(local_avatar):
        avatar_img = Image.open(local_avatar).convert("RGBA")
    else:
        # Fallback circle if image is missing
        avatar_img = Image.new("RGBA", (300, 300), (220, 225, 235, 255))

# Helper: High-Quality Antialiased Circular Crop (Clean with no border)
def crop_circular(image, target_size, border_width=0, border_color=None):
    scale = 4  # 4x supersampling for ultra-crisp edges
    s_size = target_size * scale
    s_bw = border_width * scale

    w, h = image.size
    min_dim = min(w, h)
    left = (w - min_dim) // 2
    top = (h - min_dim) // 2
    cropped = image.crop((left, top, left + min_dim, top + min_dim))
    cropped = cropped.resize((s_size, s_size), Image.Resampling.LANCZOS)

    mask = Image.new("L", (s_size, s_size), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.ellipse((0, 0, s_size, s_size), fill=255)

    output = Image.new("RGBA", (s_size, s_size), (0, 0, 0, 0))
    output.paste(cropped, (0, 0), mask)

    if s_bw > 0 and border_color is not None:
        draw_border = ImageDraw.Draw(output)
        draw_border.ellipse(
            (s_bw // 2, s_bw // 2, s_size - s_bw // 2, s_size - s_bw // 2),
            outline=border_color,
            width=s_bw
        )

    return output.resize((target_size, target_size), Image.Resampling.LANCZOS)

# 4. Generate app/favicon.ico (Multi-size Real ICO)
favicon_ico_path = os.path.join(APP_DIR, "favicon.ico")
ico_img = crop_circular(avatar_img, 64, border_width=0)
ico_img.save(
    favicon_ico_path,
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
)
print(f"Generated {favicon_ico_path} successfully!")

# 5. Generate 1200x630 og-image.png (Clean Centered Card on Dotted Canvas)
W, H = 1200, 630
og = Image.new("RGBA", (W, H), (255, 255, 255, 255))
draw = ImageDraw.Draw(og)

# Dot Grid Pattern matching website: radial-gradient(#e8e8e8 2px, transparent 1px) 22px 22px
dot_color = (232, 232, 232, 255)
for x in range(11, W, 22):
    for y in range(11, H, 22):
        draw.ellipse((x - 1, y - 1, x + 2, y + 2), fill=dot_color)

# Card Dimensions (Compact balanced width & generous vertical padding)
card_w, card_h = 520, 420
card_x = (W - card_w) // 2
card_y = (H - card_h) // 2
radius = 28

# Soft Drop Shadow
shadow_surface = Image.new("RGBA", (W, H), (0, 0, 0, 0))
s_draw = ImageDraw.Draw(shadow_surface)
s_draw.rounded_rectangle(
    (card_x, card_y + 12, card_x + card_w, card_y + card_h + 12),
    radius=radius,
    fill=(0, 0, 0, 24)
)
shadow_surface = shadow_surface.filter(ImageFilter.GaussianBlur(22))
og = Image.alpha_composite(og, shadow_surface)
draw = ImageDraw.Draw(og)

# White Card Base with subtle border
draw.rounded_rectangle(
    (card_x, card_y, card_x + card_w, card_y + card_h),
    radius=radius,
    fill=(255, 255, 255, 255),
    outline=(237, 240, 248, 255),
    width=1
)

# Avatar: 140px borderless circular crop
avatar_dim = 140
av_circle = crop_circular(avatar_img, avatar_dim, border_width=0)
av_x = (W - avatar_dim) // 2
av_y = card_y + 65
og.paste(av_circle, (av_x, av_y), av_circle)

# Cross-platform Font Selection
def load_font(font_names, size):
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            pass
    return ImageFont.load_default()

font_name = load_font(["segoeuib.ttf", "arialbd.ttf", "Helvetica-Bold.ttf", "DejaVuSans-Bold.ttf"], 36)
font_bio = load_font(["segoeui.ttf", "arial.ttf", "Helvetica.ttf", "DejaVuSans.ttf"], 18)
font_pill = load_font(["segoeuib.ttf", "arialbd.ttf", "Helvetica-Bold.ttf", "DejaVuSans-Bold.ttf"], 15)

# Text Information & Vertical Distribution (Equal 65px top & bottom padding)
name_y = av_y + avatar_dim + 32
bio_y = name_y + 36
pill_y = bio_y + 42
pill_h = 40

draw.text((W // 2, name_y), name, fill=(17, 24, 39, 255), font=font_name, anchor="mm")
draw.text((W // 2, bio_y), bio, fill=(75, 85, 99, 255), font=font_bio, anchor="mm")

# Bottom Pill Badge: Developer & Creator Profile Card (No sticker/emoji)
pill_text = "Developer & Creator Profile Card"
bbox = draw.textbbox((0, 0), pill_text, font=font_pill)
text_w = bbox[2] - bbox[0]
pill_w = text_w + 46
pill_x = (W - pill_w) // 2

draw.rounded_rectangle(
    (pill_x, pill_y, pill_x + pill_w, pill_y + pill_h),
    radius=pill_h // 2,
    fill=(243, 245, 255, 255),
    outline=(219, 227, 255, 255),
    width=1
)
draw.text((W // 2, pill_y + pill_h // 2), pill_text, fill=(60, 91, 255, 255), font=font_pill, anchor="mm")

# 6. Save directly to public/og-image.png
os.makedirs(PUBLIC_DIR, exist_ok=True)
og_path = os.path.join(PUBLIC_DIR, "og-image.png")
og.save(og_path, format="PNG")
print(f"Generated {og_path} successfully ({os.path.getsize(og_path)} bytes)!")

# 7. Clean up any leftover temporary files
temp_og = os.path.join(PROJECT_DIR, "temp_og_image.png")
if os.path.exists(temp_og):
    os.remove(temp_og)
