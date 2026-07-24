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
