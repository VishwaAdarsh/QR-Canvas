"""
QR Customization Data Model for QR Canvas.
Encapsulates all styling, color, gradient, eye, logo, resolution, margin, and preset states.
"""

from dataclasses import dataclass, field
from typing import Dict, Any, Optional

QR_STYLES = ["Classic", "Rounded", "Diamond", "Bubble", "Modern", "Hexagon"]
EYE_STYLES = ["Classic", "Rounded", "Circle", "Frame", "Leaf", "Modern"]
LOGO_SHAPES = ["Square", "Circle", "Rounded", "Transparent"]
ERROR_CORRECTION_OPTIONS = [
    ("Low (7%)", "L"),
    ("Medium (15%)", "M"),
    ("Quartile (25%)", "Q"),
    ("High (30%)", "H")
]

PRESETS_DATA: Dict[str, Dict[str, Any]] = {
    "Classic": {
        "style": "Classic",
        "fg_color": "#000000",
        "bg_color": "#FFFFFF",
        "transparent_bg": False,
        "gradient_enabled": False,
        "gradient_start": "#0F172A",
        "gradient_end": "#4F8CFF",
        "eye_style": "Classic",
        "eye_color": None,
        "logo_size": 0.20,
        "logo_shape": "Square",
        "margin": 4,
        "error_correction": "M"
    },
    "Minimal": {
        "style": "Rounded",
        "fg_color": "#1E293B",
        "bg_color": "#F8FAFC",
        "transparent_bg": False,
        "gradient_enabled": False,
        "gradient_start": "#1E293B",
        "gradient_end": "#475569",
        "eye_style": "Circle",
        "eye_color": "#0F172A",
        "logo_size": 0.20,
        "logo_shape": "Circle",
        "margin": 4,
        "error_correction": "M"
    },
    "Business": {
        "style": "Modern",
        "fg_color": "#1E3A8A",
        "bg_color": "#FFFFFF",
        "transparent_bg": False,
        "gradient_enabled": True,
        "gradient_start": "#1E3A8A",
        "gradient_end": "#2563EB",
        "eye_style": "Frame",
        "eye_color": "#1E3A8A",
        "logo_size": 0.22,
        "logo_shape": "Rounded",
        "margin": 4,
        "error_correction": "H"
    },
    "Modern": {
        "style": "Hexagon",
        "fg_color": "#064E3B",
        "bg_color": "#FFFFFF",
        "transparent_bg": False,
        "gradient_enabled": True,
        "gradient_start": "#047857",
        "gradient_end": "#10B981",
        "eye_style": "Leaf",
        "eye_color": "#064E3B",
        "logo_size": 0.20,
        "logo_shape": "Rounded",
        "margin": 4,
        "error_correction": "Q"
    },
    "Premium": {
        "style": "Diamond",
        "fg_color": "#4F8CFF",
        "bg_color": "#0B1220",
        "transparent_bg": False,
        "gradient_enabled": True,
        "gradient_start": "#00F0FF",
        "gradient_end": "#EC4899",
        "eye_style": "Modern",
        "eye_color": "#00F0FF",
        "logo_size": 0.24,
        "logo_shape": "Circle",
        "margin": 3,
        "error_correction": "H"
    }
}


@dataclass
class QRCustomizationConfig:
    style: str = "Classic"
    fg_color: str = "#000000"
    bg_color: str = "#FFFFFF"
    transparent_bg: bool = False
    
    # Gradient options
    gradient_enabled: bool = False
    gradient_start: str = "#4F8CFF"
    gradient_end: str = "#22C55E"
    
    # Eye options
    eye_style: str = "Classic"
    eye_color: Optional[str] = None  # None = use fg_color / gradient
    
    # Logo options
    logo_path: Optional[str] = None
    logo_size: float = 0.20  # 0.10 to 0.40
    logo_shape: str = "Square"
    
    # Render & Format settings
    qr_size: int = 512
    margin: int = 4
    error_correction: str = "M"

    def reset(self):
        """Reset all options to default values."""
        self.style = "Classic"
        self.fg_color = "#000000"
        self.bg_color = "#FFFFFF"
        self.transparent_bg = False
        self.gradient_enabled = False
        self.gradient_start = "#4F8CFF"
        self.gradient_end = "#22C55E"
        self.eye_style = "Classic"
        self.eye_color = None
        self.logo_path = None
        self.logo_size = 0.20
        self.logo_shape = "Square"
        self.qr_size = 512
        self.margin = 4
        self.error_correction = "M"

    def apply_preset(self, preset_name: str):
        """Apply a named preset configuration."""
        if preset_name in PRESETS_DATA:
            data = PRESETS_DATA[preset_name]
            for key, val in data.items():
                if hasattr(self, key):
                    setattr(self, key, val)

    def to_dict(self) -> Dict[str, Any]:
        """Convert config parameters to dictionary."""
        return {
            "style": self.style,
            "fg_color": self.fg_color,
            "bg_color": self.bg_color,
            "transparent_bg": self.transparent_bg,
            "gradient_enabled": self.gradient_enabled,
            "gradient_start": self.gradient_start,
            "gradient_end": self.gradient_end,
            "eye_style": self.eye_style,
            "eye_color": self.eye_color,
            "logo_path": self.logo_path,
            "logo_size": self.logo_size,
            "logo_shape": self.logo_shape,
            "qr_size": self.qr_size,
            "margin": self.margin,
            "error_correction": self.error_correction,
        }
