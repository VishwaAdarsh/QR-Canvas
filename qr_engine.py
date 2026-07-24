"""
Core QR Generator Engine for QR Canvas.
Handles payload creation, matrix calculation, custom styling, eye shapes, gradients,
logo embedding with shape masks, performance benchmarking, and clipboard copying.
"""

import io
import os
import time
import math
import qrcode
from qrcode.constants import ERROR_CORRECT_L, ERROR_CORRECT_M, ERROR_CORRECT_Q, ERROR_CORRECT_H
from PIL import Image, ImageDraw, ImageOps, ImageTk

EC_MAP = {
    "L": ERROR_CORRECT_L,
    "M": ERROR_CORRECT_M,
    "Q": ERROR_CORRECT_Q,
    "H": ERROR_CORRECT_H
}


def hex_to_rgb(hex_str):
    """Convert hex color string (e.g. #0F172A) to RGB tuple."""
    if not hex_str:
        return (0, 0, 0)
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = ''.join([c*2 for c in hex_str])
    if len(hex_str) == 6:
        return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
    return (0, 0, 0)


def interpolate_color(color1_hex, color2_hex, factor):
    """Interpolate linearly between two hex colors by factor [0.0, 1.0]."""
    factor = max(0.0, min(1.0, factor))
    c1 = hex_to_rgb(color1_hex)
    c2 = hex_to_rgb(color2_hex)
    r = int(c1[0] + (c2[0] - c1[0]) * factor)
    g = int(c1[1] + (c2[1] - c1[1]) * factor)
    b = int(c1[2] + (c2[2] - c1[2]) * factor)
    return (r, g, b)


def is_eye_module(r, c, row_count, col_count):
    """Check if (r, c) falls within any of the 3 finder pattern regions (7x7 blocks)."""
    if r < 7 and c < 7:
        return ("TL", r, c)
    if r < 7 and c >= col_count - 7:
        return ("TR", r, c - (col_count - 7))
    if r >= row_count - 7 and c < 7:
        return ("BL", r - (row_count - 7), c)
    return None


class QREngine:
    def __init__(self):
        pass

    @staticmethod
    def generate_qr_image(
        data,
        fg_color="#000000",
        bg_color="#FFFFFF",
        transparent_bg=False,
        module_style="square",
        error_correction="M",
        logo_path=None,
        logo_size=0.20,
        logo_shape="Square",
        gradient_enabled=False,
        gradient_start="#4F8CFF",
        gradient_end="#22C55E",
        eye_style="Classic",
        eye_color=None,
        box_size=None,
        border=4,
        qr_size=512,
        config=None
    ):
        """
        Generate a high-quality PIL Image of the customized QR Code.
        Accepts either explicit kwargs or a QRCustomizationConfig instance.
        """
        # Unpack config object if provided
        if config is not None:
            fg_color = getattr(config, "fg_color", fg_color)
            bg_color = getattr(config, "bg_color", bg_color)
            transparent_bg = getattr(config, "transparent_bg", transparent_bg)
            module_style = getattr(config, "style", module_style)
            error_correction = getattr(config, "error_correction", error_correction)
            logo_path = getattr(config, "logo_path", logo_path)
            logo_size = getattr(config, "logo_size", logo_size)
            logo_shape = getattr(config, "logo_shape", logo_shape)
            gradient_enabled = getattr(config, "gradient_enabled", gradient_enabled)
            gradient_start = getattr(config, "gradient_start", gradient_start)
            gradient_end = getattr(config, "gradient_end", gradient_end)
            eye_style = getattr(config, "eye_style", eye_style)
            eye_color = getattr(config, "eye_color", eye_color)
            border = getattr(config, "margin", border)
            qr_size = getattr(config, "qr_size", qr_size)

        if not data:
            data = "https://github.com"

        # Force High Error Correction if logo is embedded
        ec_level = EC_MAP.get(error_correction, ERROR_CORRECT_M)
        if logo_path and os.path.exists(logo_path):
            ec_level = ERROR_CORRECT_H

        qr = qrcode.QRCode(
            version=None,
            error_correction=ec_level,
            box_size=10,  # Matrix scaling factor
            border=border
        )
        qr.add_data(data)
        qr.make(fit=True)

        matrix = qr.get_matrix()
        row_count = len(matrix)
        col_count = len(matrix[0])

        # Dynamic box_size calculation to target desired qr_size resolution
        if box_size is None:
            box_size = max(6, qr_size // col_count)

        img_width = col_count * box_size
        img_height = row_count * box_size

        # Create base image (RGBA for transparency support)
        if transparent_bg:
            bg_fill = (0, 0, 0, 0)
        else:
            bg_rgb = hex_to_rgb(bg_color)
            bg_fill = (bg_rgb[0], bg_rgb[1], bg_rgb[2], 255)

        img = Image.new("RGBA", (img_width, img_height), bg_fill)
        draw = ImageDraw.Draw(img)

        fg_rgb = hex_to_rgb(fg_color)
        eye_rgb = hex_to_rgb(eye_color) if eye_color else None

        # -------------------------------------------------------------
        # 1. Render Data Modules (excluding Finder Pattern Eyes)
        # -------------------------------------------------------------
        for r in range(row_count):
            for c in range(col_count):
                if matrix[r][c]:
                    eye_info = is_eye_module(r, c, row_count, col_count)
                    if eye_info is not None:
                        continue  # Handled separately in Eye rendering pass

                    x0 = c * box_size
                    y0 = r * box_size
                    x1 = x0 + box_size
                    y1 = y0 + box_size

                    # Calculate color (Gradient or Solid)
                    if gradient_enabled:
                        t = (r + c) / float(max(1, row_count + col_count - 2))
                        mod_color = interpolate_color(gradient_start, gradient_end, t)
                    else:
                        mod_color = fg_rgb

                    # Render module based on style
                    style_key = str(module_style).lower()
                    if style_key in ("dots", "bubble"):
                        draw.ellipse([x0 + 1, y0 + 1, x1 - 1, y1 - 1], fill=mod_color)
                    elif style_key in ("rounded", "rounded corners"):
                        radius = max(2, box_size // 3)
                        draw.rounded_rectangle([x0, y0, x1 - 1, y1 - 1], radius=radius, fill=mod_color)
                    elif style_key == "diamond":
                        cx = (x0 + x1) / 2.0
                        cy = (y0 + y1) / 2.0
                        pts = [(cx, y0), (x1 - 1, cy), (cx, y1 - 1), (x0, cy)]
                        draw.polygon(pts, fill=mod_color)
                    elif style_key == "hexagon":
                        w = x1 - x0
                        h = y1 - y0
                        pts = [
                            (x0 + w * 0.25, y0),
                            (x0 + w * 0.75, y0),
                            (x1 - 1, y0 + h * 0.5),
                            (x0 + w * 0.75, y1 - 1),
                            (x0 + w * 0.25, y1 - 1),
                            (x0, y0 + h * 0.5)
                        ]
                        draw.polygon(pts, fill=mod_color)
                    elif style_key == "modern":
                        radius = max(3, box_size // 2)
                        draw.rounded_rectangle([x0, y0, x1 - 1, y1 - 1], radius=radius, fill=mod_color)
                    else:
                        # Classic / Square
                        draw.rectangle([x0, y0, x1 - 1, y1 - 1], fill=mod_color)

        # -------------------------------------------------------------
        # 2. Render Finder Pattern Eyes (Top-Left, Top-Right, Bottom-Left)
        # -------------------------------------------------------------
        eye_origins = [
            (border * box_size, border * box_size),  # Top-Left
            ((col_count - border - 7) * box_size, border * box_size),  # Top-Right
            (border * box_size, (row_count - border - 7) * box_size)  # Bottom-Left
        ]

        eye_style_key = str(eye_style).lower()

        for ox, oy in eye_origins:
            # Color for eye: custom eye_color or gradient or fg_color
            if eye_rgb:
                e_color = eye_rgb
            elif gradient_enabled:
                t = (oy / float(img_height) + ox / float(img_width)) / 2.0
                e_color = interpolate_color(gradient_start, gradient_end, t)
            else:
                e_color = fg_rgb

            eye_w = 7 * box_size
            eye_h = 7 * box_size
            ex0 = ox
            ey0 = oy
            ex1 = ox + eye_w
            ey1 = oy + eye_h

            # Inner Pupil bounds (3x3 modules centered in 7x7 eye)
            px0 = ox + 2 * box_size
            py0 = oy + 2 * box_size
            px1 = px0 + 3 * box_size
            py1 = py0 + 3 * box_size

            if eye_style_key == "circle":
                # Outer ring
                draw.ellipse([ex0, ey0, ex1 - 1, ey1 - 1], fill=e_color)
                # Clear inner 5x5 ring space
                ix0 = ox + box_size
                iy0 = oy + box_size
                ix1 = ix0 + 5 * box_size
                iy1 = iy0 + 5 * box_size
                draw.ellipse([ix0, iy0, ix1 - 1, iy1 - 1], fill=bg_fill)
                # Center Pupil Circle
                draw.ellipse([px0, py0, px1 - 1, py1 - 1], fill=e_color)

            elif eye_style_key == "rounded":
                r_outer = max(4, box_size * 2)
                r_inner = max(2, box_size)
                # Outer rounded frame
                draw.rounded_rectangle([ex0, ey0, ex1 - 1, ey1 - 1], radius=r_outer, fill=e_color)
                ix0 = ox + box_size
                iy0 = oy + box_size
                ix1 = ix0 + 5 * box_size
                iy1 = iy0 + 5 * box_size
                draw.rounded_rectangle([ix0, iy0, ix1 - 1, iy1 - 1], radius=r_outer - box_size, fill=bg_fill)
                # Center Pupil
                draw.rounded_rectangle([px0, py0, px1 - 1, py1 - 1], radius=r_inner, fill=e_color)

            elif eye_style_key == "frame":
                # Sleek frame with thin rounded outline
                r_outer = max(6, box_size * 2)
                draw.rounded_rectangle([ex0, ey0, ex1 - 1, ey1 - 1], radius=r_outer, fill=e_color)
                ix0 = ox + box_size
                iy0 = oy + box_size
                ix1 = ix0 + 5 * box_size
                iy1 = iy0 + 5 * box_size
                draw.rounded_rectangle([ix0, iy0, ix1 - 1, iy1 - 1], radius=max(2, r_outer - box_size), fill=bg_fill)
                # Center Pupil square
                draw.rectangle([px0, py0, px1 - 1, py1 - 1], fill=e_color)

            elif eye_style_key == "leaf":
                # Leaf shape with rounded top-left and bottom-right corners
                r_outer = box_size * 3
                draw.rounded_rectangle([ex0, ey0, ex1 - 1, ey1 - 1], radius=r_outer, fill=e_color)
                ix0 = ox + box_size
                iy0 = oy + box_size
                ix1 = ix0 + 5 * box_size
                iy1 = iy0 + 5 * box_size
                draw.rounded_rectangle([ix0, iy0, ix1 - 1, iy1 - 1], radius=max(2, r_outer - box_size), fill=bg_fill)
                # Leaf pupil
                draw.rounded_rectangle([px0, py0, px1 - 1, py1 - 1], radius=box_size, fill=e_color)

            elif eye_style_key == "modern":
                # Modern smooth frame
                r_outer = box_size * 2
                draw.rounded_rectangle([ex0, ey0, ex1 - 1, ey1 - 1], radius=r_outer, fill=e_color)
                ix0 = ox + box_size
                iy0 = oy + box_size
                ix1 = ix0 + 5 * box_size
                iy1 = iy0 + 5 * box_size
                draw.rounded_rectangle([ix0, iy0, ix1 - 1, iy1 - 1], radius=max(2, r_outer - box_size), fill=bg_fill)
                draw.ellipse([px0, py0, px1 - 1, py1 - 1], fill=e_color)

            else:
                # Classic (Default Square)
                draw.rectangle([ex0, ey0, ex1 - 1, ey1 - 1], fill=e_color)
                ix0 = ox + box_size
                iy0 = oy + box_size
                ix1 = ix0 + 5 * box_size
                iy1 = iy0 + 5 * box_size
                draw.rectangle([ix0, iy0, ix1 - 1, iy1 - 1], fill=bg_fill)
                draw.rectangle([px0, py0, px1 - 1, py1 - 1], fill=e_color)

        # -------------------------------------------------------------
        # 3. Logo Overlay & Masking
        # -------------------------------------------------------------
        if logo_path and os.path.exists(logo_path):
            try:
                logo = Image.open(logo_path).convert("RGBA")

                # Calculate logo target dimensions
                max_logo_size = int(img_width * float(logo_size))
                max_logo_size = max(32, max_logo_size)
                logo.thumbnail((max_logo_size, max_logo_size), Image.Resampling.LANCZOS)

                logo_w, logo_h = logo.size

                # Apply Logo Shape Mask if requested
                shape_key = str(logo_shape).lower()
                if shape_key == "circle":
                    mask = Image.new("L", (logo_w, logo_h), 0)
                    mask_draw = ImageDraw.Draw(mask)
                    mask_draw.ellipse([0, 0, logo_w - 1, logo_h - 1], fill=255)
                    logo.putalpha(ImageOps.fit(mask, (logo_w, logo_h)))
                elif shape_key in ("rounded", "rounded rectangle"):
                    mask = Image.new("L", (logo_w, logo_h), 0)
                    mask_draw = ImageDraw.Draw(mask)
                    mask_draw.rounded_rectangle([0, 0, logo_w - 1, logo_h - 1], radius=max(6, logo_w // 5), fill=255)
                    logo.putalpha(ImageOps.fit(mask, (logo_w, logo_h)))

                # Create background badge behind logo for readability unless transparent
                padding = 8
                bg_badge_w = logo_w + padding * 2
                bg_badge_h = logo_h + padding * 2

                if not transparent_bg and shape_key != "transparent":
                    badge = Image.new("RGBA", (bg_badge_w, bg_badge_h), bg_fill)
                    badge_draw = ImageDraw.Draw(badge)
                    if shape_key == "circle":
                        badge_draw.ellipse([0, 0, bg_badge_w - 1, bg_badge_h - 1], fill=bg_fill)
                    elif shape_key in ("rounded", "rounded rectangle"):
                        badge_draw.rounded_rectangle([0, 0, bg_badge_w - 1, bg_badge_h - 1], radius=max(8, bg_badge_w // 5), fill=bg_fill)
                    else:
                        badge_draw.rectangle([0, 0, bg_badge_w - 1, bg_badge_h - 1], fill=bg_fill)

                    badge_pos_x = (img_width - bg_badge_w) // 2
                    badge_pos_y = (img_height - bg_badge_h) // 2
                    img.paste(badge, (badge_pos_x, badge_pos_y), badge)

                logo_pos_x = (img_width - logo_w) // 2
                logo_pos_y = (img_height - logo_h) // 2
                img.paste(logo, (logo_pos_x, logo_pos_y), logo)

            except Exception as e:
                print(f"Error processing logo overlay: {e}")

        return img

    @classmethod
    def generate_qr_with_benchmark(cls, data, **kwargs):
        """Generates QR code and returns tuple: (pil_image, elapsed_seconds)."""
        start_time = time.perf_counter()
        img = cls.generate_qr_image(data, **kwargs)
        elapsed = time.perf_counter() - start_time
        return img, elapsed

    @staticmethod
    def generate_svg_string(data, fg_color="#000000", bg_color="#FFFFFF", error_correction="M"):
        """Generate SVG vector markup string."""
        import qrcode.image.svg
        ec_level = EC_MAP.get(error_correction, ERROR_CORRECT_M)

        factory = qrcode.image.svg.SvgPathImage
        qr = qrcode.QRCode(error_correction=ec_level, box_size=10, border=4)
        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(image_factory=factory, fill_color=fg_color, back_color=bg_color)
        stream = io.BytesIO()
        img.save(stream)
        return stream.getvalue().decode('utf-8')

    @staticmethod
    def copy_to_clipboard(pil_image):
        """Copy image directly to Windows Clipboard."""
        try:
            output = io.BytesIO()
            pil_image.convert("RGB").save(output, "BMP")
            data = output.getvalue()[14:]  # Remove BMP header for Windows DIB format
            output.close()

            import win32clipboard
            win32clipboard.OpenClipboard()
            win32clipboard.EmptyClipboard()
            win32clipboard.SetClipboardData(win32clipboard.CF_DIB, data)
            win32clipboard.CloseClipboard()
            return True, "Image copied to clipboard!"
        except Exception:
            return False, "win32clipboard not installed; use Save File."
