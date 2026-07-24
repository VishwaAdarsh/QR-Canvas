from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Dict, Any

class QRRenderRequest(BaseModel):
    qr_type: str = Field(default="url", description="Type of QR payload (url, text, wifi, vcard, email, phone, sms, whatsapp, event, location)")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Payload data key-value dictionary")
    
    # Module Styling
    module_shape: str = Field(default="square", description="square, rounded, dots, diamond, bubble, circle, hexagon")
    eye_style: str = Field(default="square", description="square, rounded, circle, frame, modern, minimal")
    
    # Colors
    fg_color: str = Field(default="#000000", description="Foreground hex color")
    bg_color: str = Field(default="#ffffff", description="Background hex color")
    eye_outer_color: Optional[str] = Field(default=None, description="Custom outer eye color")
    eye_inner_color: Optional[str] = Field(default=None, description="Custom inner eye color")
    transparent_bg: bool = Field(default=False)
    
    # Gradient
    use_gradient: bool = Field(default=False)
    gradient_color2: Optional[str] = Field(default="#4f46e5")
    gradient_type: str = Field(default="linear", description="linear or radial")
    
    # Logo
    logo_base64: Optional[str] = Field(default=None, description="Base64 encoded logo image")
    logo_scale: float = Field(default=0.2, ge=0.05, le=0.35)
    remove_logo_bg: bool = Field(default=False)
    logo_margin: int = Field(default=2)
    
    # Frame
    frame_style: str = Field(default="none", description="none, simple, badge, scanner, phone, banner")
    frame_text: str = Field(default="SCAN ME")
    frame_color: str = Field(default="#4f46e5")
    frame_text_color: str = Field(default="#ffffff")
    
    # Dimensions & Error Correction
    size: int = Field(default=1024, ge=256, le=4096)
    error_correction: str = Field(default="H", description="L, M, Q, H")
