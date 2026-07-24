"""
UI Theme & Design Tokens for QR Canvas.
Defines exact colors for Dark and Light (Bright) modes, typography, radii, spacing, and presets.
"""

DARK_THEME_COLORS = {
    "background": "#0B1220",
    "surface": "#121826",
    "glass_card": "#161F33",
    "glass_card_hover": "#1D2840",
    "border": "#232E45",
    "border_focus": "#4F8CFF",
    
    "primary": "#4F8CFF",
    "primary_hover": "#6AA5FF",
    "primary_disabled": "#2B4C8C",
    
    "success": "#22C55E",
    "warning": "#F59E0B",
    "error": "#EF4444",
    
    "text_primary": "#FFFFFF",
    "text_secondary": "#B7C0CF",
    "text_muted": "#8793A8"
}

LIGHT_THEME_COLORS = {
    "background": "#F1F5F9",
    "surface": "#FFFFFF",
    "glass_card": "#F8FAFC",
    "glass_card_hover": "#E2E8F0",
    "border": "#CBD5E1",
    "border_focus": "#2563EB",
    
    "primary": "#2563EB",
    "primary_hover": "#1D4ED8",
    "primary_disabled": "#93C5FD",
    
    "success": "#16A34A",
    "warning": "#D97706",
    "error": "#DC2626",
    
    "text_primary": "#0F172A",
    "text_secondary": "#475569",
    "text_muted": "#64748B"
}

# Tuple Theme Colors for CustomTkinter dual (Light, Dark) mode support
THEME_COLORS = {
    k: (LIGHT_THEME_COLORS[k], DARK_THEME_COLORS[k]) for k in DARK_THEME_COLORS
}

# Radii Specifications
RADII = {
    "input": 14,
    "button": 14,
    "card": 20,
    "preview": 24,
    "toast": 18
}

# Typography Standards
FONT_FAMILY = ("Segoe UI", "Inter", "Arial")

TYPOGRAPHY = {
    "heading": (FONT_FAMILY[0], 24, "bold"),
    "section": (FONT_FAMILY[0], 18, "bold"),
    "label": (FONT_FAMILY[0], 13, "bold"),
    "input": (FONT_FAMILY[0], 14, "normal"),
    "button": (FONT_FAMILY[0], 14, "bold"),
    "status": (FONT_FAMILY[0], 12, "normal"),
    "subtitle": (FONT_FAMILY[0], 13, "normal")
}

# Custom QR Color Presets
COLOR_PRESETS = [
    {
        "name": "Classic Dark",
        "fg": "#0F172A",
        "bg": "#FFFFFF",
        "module_style": "square",
        "description": "High contrast black on crisp white background"
    },
    {
        "name": "Cyber Blue",
        "fg": "#4F8CFF",
        "bg": "#0B1220",
        "module_style": "rounded",
        "description": "Electric blue accent on deep QR Canvas dark background"
    },
    {
        "name": "Emerald Tech",
        "fg": "#22C55E",
        "bg": "#0D1E16",
        "module_style": "rounded",
        "description": "Modern green on dark mint surface"
    },
    {
        "name": "Cyberpunk Neon",
        "fg": "#00F0FF",
        "bg": "#0D0F18",
        "module_style": "dots",
        "description": "Vibrant cyan glow on dark obsidian"
    },
    {
        "name": "Royal Gold",
        "fg": "#D4AF37",
        "bg": "#121212",
        "module_style": "square",
        "description": "Luxurious metallic gold on dark background"
    }
]

# Module Patterns
MODULE_STYLES = [
    ("Standard Square", "square"),
    ("Rounded Corners", "rounded"),
    ("Circular Dots", "dots")
]

# Error Correction Levels
ERROR_CORRECTION_LEVELS = [
    ("Low (7%)", "L"),
    ("Medium (15%)", "M"),
    ("Quartile (25%)", "Q"),
    ("High (30%)", "H")
]
