import io
import base64
import segno
from PIL import Image, ImageDraw, ImageOps, ImageFont
from typing import Tuple, Optional
from app.schemas.qr import QRRenderRequest

def format_payload(qr_type: str, data: dict) -> str:
    """Formats payload dictionary into standard RFC/URI payload string based on qr_type."""
    if qr_type == "url":
        url = data.get("url", "https://qr-canvas.com")
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        return url
    elif qr_type == "text":
        return data.get("text", "Hello World from QR Canvas")
    elif qr_type == "email":
        email = data.get("email", "")
        subject = data.get("subject", "")
        body = data.get("body", "")
        return f"mailto:{email}?subject={subject}&body={body}"
    elif qr_type == "phone":
        return f"tel:{data.get('phone', '')}"
    elif qr_type == "sms":
        return f"smsto:{data.get('phone', '')}:{data.get('message', '')}"
    elif qr_type == "whatsapp":
        phone = data.get("phone", "").replace("+", "").replace(" ", "")
        msg = data.get("message", "")
        return f"https://wa.me/{phone}?text={msg}"
    elif qr_type == "wifi":
        ssid = data.get("ssid", "")
        password = data.get("password", "")
        encryption = data.get("encryption", "WPA")
        hidden = "true" if data.get("hidden", False) else "false"
        return f"WIFI:S:{ssid};T:{encryption};P:{password};H:{hidden};;"
    elif qr_type == "vcard":
        fn = data.get("firstName", "")
        ln = data.get("lastName", "")
        org = data.get("org", "")
        title = data.get("title", "")
        phone = data.get("phone", "")
        email = data.get("email", "")
        url = data.get("url", "")
        return (
            "BEGIN:VCARD\n"
            "VERSION:3.0\n"
            f"N:{ln};{fn};;;\n"
            f"FN:{fn} {ln}\n"
            f"ORG:{org}\n"
            f"TITLE:{title}\n"
            f"TEL;TYPE=CELL:{phone}\n"
            f"EMAIL:{email}\n"
            f"URL:{url}\n"
            "END:VCARD"
        )
    elif qr_type == "event":
        title = data.get("title", "Event")
        start = data.get("startDate", "").replace("-", "").replace(":", "")
        end = data.get("endDate", "").replace("-", "").replace(":", "")
        loc = data.get("location", "")
        desc = data.get("description", "")
        return (
            "BEGIN:VEVENT\n"
            f"SUMMARY:{title}\n"
            f"DTSTART:{start}\n"
            f"DTEND:{end}\n"
            f"LOCATION:{loc}\n"
            f"DESCRIPTION:{desc}\n"
            "END:VEVENT"
        )
    elif qr_type == "location":
        url = data.get("locationUrl") or data.get("url")
        if not url:
            lat = data.get("lat")
            lng = data.get("lng")
            if lat and lng:
                return f"https://maps.google.com/?q={lat},{lng}"
            return "https://maps.google.com/?q=San+Francisco+CA"
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
        return url
    elif qr_type == "social":
        platform = data.get("socialPlatform", "instagram")
        handle = data.get("socialHandle", "").lstrip("@").strip()
        bases = {
            "instagram": "https://instagram.com/",
            "x": "https://x.com/",
            "github": "https://github.com/",
            "linkedin": "https://linkedin.com/in/",
            "youtube": "https://youtube.com/@",
            "facebook": "https://facebook.com/"
        }
        return f"{bases.get(platform, 'https://instagram.com/')}{handle}"
    elif qr_type == "pdf":
        return data.get("pdfUrl", "https://qr-canvas.com/docs/unconfigured")
    elif qr_type == "appstore":
        raw = data.get("appUrl", "").strip()
        if not raw:
            return "https://apps.apple.com"
        if raw.startswith(("http://", "https://")):
            return raw
        if data.get("appPlatform") == "android":
            return f"https://play.google.com/store/apps/details?id={raw}"
        return f"https://apps.apple.com/app/id{raw}"
    elif qr_type == "payment":
        upi = data.get("upiId", "").strip()
        name = data.get("payeeName", "QR Canvas")
        amt = f"&am={data.get('amount')}&cu=INR" if data.get("amount") else ""
        return f"upi://pay?pa={upi}&pn={name}{amt}"
    else:
        return data.get("content") or data.get("url") or data.get("text") or "https://qr-canvas.com"

def generate_svg_qr(req: QRRenderRequest) -> str:
    """Generates clean SVG string using Segno engine."""
    payload_str = format_payload(req.qr_type, req.payload)
    qr = segno.make(payload_str, error=req.error_correction.lower())
    
    out = io.StringIO()
    bg = None if req.transparent_bg else req.bg_color
    dark = req.fg_color
    
    qr.save(out, kind="svg", dark=dark, light=bg, scale=10)
    return out.getvalue()

def generate_png_qr(req: QRRenderRequest) -> bytes:
    """Generates high-resolution PNG image with logo overlay & custom formatting using Pillow."""
    payload_str = format_payload(req.qr_type, req.payload)
    qr = segno.make(payload_str, error=req.error_correction.lower())
    
    out_buf = io.BytesIO()
    bg = None if req.transparent_bg else req.bg_color
    qr.save(out_buf, kind="png", dark=req.fg_color, light=bg, scale=max(8, req.size // 35))
    out_buf.seek(0)
    
    base_img = Image.open(out_buf).convert("RGBA")
    
    # Check if logo overlay requested
    if req.logo_base64:
        try:
            if "," in req.logo_base64:
                logo_data = base64.b64decode(req.logo_base64.split(",")[1])
            else:
                logo_data = base64.b64decode(req.logo_base64)
                
            logo = Image.open(io.BytesIO(logo_data)).convert("RGBA")
            
            # Calculate target size
            w, h = base_img.size
            max_logo_size = int(w * req.logo_scale)
            logo.thumbnail((max_logo_size, max_logo_size), Image.Resampling.LANCZOS)
            
            # Paste in center
            lw, lh = logo.size
            pos_x = (w - lw) // 2
            pos_y = (h - lh) // 2
            
            # Draw background box for logo protection margin
            if req.logo_margin > 0 and not req.transparent_bg:
                draw = ImageDraw.Draw(base_img)
                margin = req.logo_margin * 4
                bg_col = req.bg_color if not req.transparent_bg else "#ffffff"
                draw.rectangle(
                    [pos_x - margin, pos_y - margin, pos_x + lw + margin, pos_y + lh + margin],
                    fill=bg_col
                )
                
            base_img.paste(logo, (pos_x, pos_y), logo)
        except Exception as e:
            print(f"Error applying logo overlay: {e}")
            
    final_buf = io.BytesIO()
    base_img.save(final_buf, format="PNG")
    return final_buf.getvalue()
