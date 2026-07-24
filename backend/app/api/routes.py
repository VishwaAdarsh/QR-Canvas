from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import Response
from app.schemas.qr import QRRenderRequest
from app.services.qr_engine import generate_svg_qr, generate_png_qr

router = APIRouter(prefix="/api/v1", tags=["QR Studio"])

@router.post("/qr/render-svg")
async def render_svg(req: QRRenderRequest):
    """Renders real-time vector SVG string."""
    try:
        svg_content = generate_svg_qr(req)
        return Response(content=svg_content, media_type="image/svg+xml")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/qr/render-png")
async def render_png(req: QRRenderRequest):
    """Renders high-resolution raster PNG file stream."""
    try:
        png_bytes = generate_png_qr(req)
        return Response(content=png_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "online", "service": "QR Canvas API", "version": "1.0.0"}

@router.get("/capabilities")
async def get_capabilities():
    """Returns capabilities supported by backend deployment."""
    import os
    has_cloud_storage = bool(
        os.getenv("S3_BUCKET") or 
        os.getenv("CLOUDINARY_URL") or 
        os.getenv("AZURE_STORAGE_CONNECTION_STRING") or 
        os.getenv("GCS_BUCKET")
    )
    return {
        "cloud_storage_configured": has_cloud_storage,
        "max_upload_size_mb": 10 if has_cloud_storage else 0,
        "supported_payloads": [
            "url", "text", "email", "phone", "sms", "whatsapp", "wifi",
            "vcard", "event", "location", "social", "appstore", "payment"
        ] + (["pdf"] if has_cloud_storage else [])
    }
