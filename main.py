"""
QR Canvas - Premium Desktop Application
Version: 2.0 (Professional QR Designer with Advanced Customization & Live Preview)
Platform: Windows Desktop (Python + CustomTkinter)
"""

import os
import sys
import time
import tkinter as tk
from tkinter import filedialog, messagebox, colorchooser
from PIL import Image, ImageTk

# Import CustomTkinter with fallback
try:
    # pyrefly: ignore [missing-import]
    import customtkinter as ctk
    ctk.set_appearance_mode("Dark")
    ctk.set_default_color_theme("blue")
    CTK_AVAILABLE = True
except ImportError:
    CTK_AVAILABLE = False
    print("CustomTkinter not installed. Running in standard Tkinter mode.")

from qr_engine import QREngine
from ui_theme import THEME_COLORS, RADII, TYPOGRAPHY, COLOR_PRESETS, MODULE_STYLES
from history_manager import HistoryManager
from customization_model import (
    QRCustomizationConfig, QR_STYLES, EYE_STYLES, LOGO_SHAPES,
    ERROR_CORRECTION_OPTIONS, PRESETS_DATA
)


class ToastNotification(ctk.CTkFrame if CTK_AVAILABLE else tk.Frame):
    """Floating Toast Notification component with 18px corner radius and auto-dismiss."""
    def __init__(self, master, message, toast_type="success", duration_ms=3000):
        bg_color = THEME_COLORS["success"] if toast_type == "success" else (
            THEME_COLORS["warning"] if toast_type == "warning" else THEME_COLORS["error"]
        )
        
        if CTK_AVAILABLE:
            super().__init__(
                master,
                corner_radius=RADII["toast"],
                fg_color=bg_color,
                border_width=0
            )
            self.label = ctk.CTkLabel(
                self,
                text=message,
                font=TYPOGRAPHY["button"],
                text_color="#FFFFFF"
            )
            self.label.pack(padx=20, pady=12)
        else:
            super().__init__(master, bg=bg_color)
            self.label = tk.Label(self, text=message, fg="#FFFFFF", bg=bg_color, font=("Segoe UI", 11, "bold"))
            self.label.pack(padx=20, pady=12)
            
        self.duration_ms = duration_ms
        self.after_id = None

    def show(self, relx=0.96, rely=0.92):
        self.place(relx=relx, rely=rely, anchor="se")
        self.after_id = self.after(self.duration_ms, self.dismiss)

    def dismiss(self):
        if self.after_id:
            self.after_cancel(self.after_id)
        self.place_forget()
        self.destroy()


class QRCanvasApp(ctk.CTk if CTK_AVAILABLE else tk.Tk):
    def __init__(self):
        super().__init__()

        self.title("QR Canvas - Professional QR Designer")
        self.geometry("1240x820")
        self.minsize(1050, 720)
        
        if CTK_AVAILABLE:
            self.configure(fg_color=THEME_COLORS["background"])

        # Center window on screen
        self.update_idletasks()
        width = 1240
        height = 820
        x = (self.winfo_screenwidth() // 2) - (width // 2)
        y = (self.winfo_screenheight() // 2) - (height // 2)
        self.geometry(f"{width}x{height}+{x}+{y}")

        # State Variables
        self.save_directory = os.path.join(os.path.expanduser("~"), "Pictures")
        if not os.path.exists(self.save_directory):
            self.save_directory = os.path.expanduser("~")

        self.current_qr_image = None
        self.current_qr_benchmark = 0.0
        self.active_toast = None
        self.history_manager = HistoryManager()
        self.custom_config = QRCustomizationConfig()
        self.customize_expanded = False
        self.current_appearance = "Dark"

        # Keyboard Shortcut Bindings
        self.bind("<Return>", lambda e: self.generate_qr_code())
        self.bind("<Control-s>", lambda e: self.save_qr_code())
        self.bind("<Control-o>", lambda e: self.browse_save_folder())
        self.bind("<Control-t>", lambda e: self.toggle_appearance_mode())

        # Construct UI
        self._build_header()
        self._build_main_layout()
        self._build_status_bar()

        # Initialize Idle State
        self.set_ui_state("idle")

    def _build_header(self):
        """Top Header Bar with App Logo, Title, Tagline, and Status Badge."""
        self.header_frame = ctk.CTkFrame(
            self,
            corner_radius=0,
            fg_color=THEME_COLORS["surface"],
            height=68
        ) if CTK_AVAILABLE else tk.Frame(self, bg=THEME_COLORS["surface"], height=68)
        
        self.header_frame.pack(side="top", fill="x")
        self.header_frame.pack_propagate(False)

        # App Logo & Title Group
        logo_label = ctk.CTkLabel(
            self.header_frame,
            text="⚡",
            font=ctk.CTkFont(size=24)
        ) if CTK_AVAILABLE else tk.Label(self.header_frame, text="⚡", font=("Segoe UI", 18), bg=THEME_COLORS["surface"], fg=THEME_COLORS["primary"])
        logo_label.pack(side="left", padx=(24, 8), pady=16)

        title_label = ctk.CTkLabel(
            self.header_frame,
            text="QR Canvas",
            font=TYPOGRAPHY["heading"],
            text_color=THEME_COLORS["text_primary"]
        ) if CTK_AVAILABLE else tk.Label(self.header_frame, text="QR Canvas", font=("Segoe UI", 18, "bold"), fg=THEME_COLORS["text_primary"], bg=THEME_COLORS["surface"])
        title_label.pack(side="left", pady=16)

        subtitle_label = ctk.CTkLabel(
            self.header_frame,
            text="—   Professional QR Designer & Generator",
            font=TYPOGRAPHY["subtitle"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.header_frame, text="— Professional QR Designer & Generator", font=("Segoe UI", 11), fg=THEME_COLORS["text_secondary"], bg=THEME_COLORS["surface"])
        subtitle_label.pack(side="left", padx=(12, 0), pady=16)

        # Platform Version Badge on Right
        version_badge = ctk.CTkFrame(
            self.header_frame,
            corner_radius=12,
            fg_color=THEME_COLORS["glass_card"],
            border_width=1,
            border_color=THEME_COLORS["border"]
        ) if CTK_AVAILABLE else tk.Frame(self.header_frame, bg=THEME_COLORS["glass_card"])
        version_badge.pack(side="right", padx=(0, 24), pady=18)

        v_label = ctk.CTkLabel(
            version_badge,
            text="v2.0 Pro  |  Desktop",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_muted"]
        ) if CTK_AVAILABLE else tk.Label(version_badge, text="v2.0 Pro", fg=THEME_COLORS["text_muted"], bg=THEME_COLORS["glass_card"])
        v_label.pack(padx=12, pady=4)

        # Dark / Bright Mode Toggle Segmented Control
        self.theme_segment = ctk.CTkSegmentedButton(
            self.header_frame,
            values=["🌙 Dark", "☀️ Bright"],
            font=TYPOGRAPHY["status"],
            corner_radius=12,
            fg_color=THEME_COLORS["glass_card"],
            selected_color=THEME_COLORS["primary"],
            selected_hover_color=THEME_COLORS["primary_hover"],
            command=self._on_theme_segment_changed
        ) if CTK_AVAILABLE else tk.Button(self.header_frame, text="Toggle Theme", command=self.toggle_appearance_mode)
        self.theme_segment.set("🌙 Dark") if CTK_AVAILABLE else None
        self.theme_segment.pack(side="right", padx=(0, 12), pady=16)

    def _build_main_layout(self):
        """Two Column Main Layout: 360px Left Control Panel & Right Preview Panel."""
        self.main_container = ctk.CTkFrame(
            self,
            fg_color=THEME_COLORS["background"]
        ) if CTK_AVAILABLE else tk.Frame(self, bg=THEME_COLORS["background"])
        
        self.main_container.pack(side="top", fill="both", expand=True, padx=24, pady=20)

        # ------------------- LEFT CONTROL PANEL (360px) -------------------
        self.left_panel = ctk.CTkFrame(
            self.main_container,
            width=380,
            corner_radius=RADII["card"],
            fg_color=THEME_COLORS["surface"],
            border_width=1,
            border_color=THEME_COLORS["border"]
        ) if CTK_AVAILABLE else tk.Frame(self.main_container, bg=THEME_COLORS["surface"], width=380)
        
        self.left_panel.pack(side="left", fill="both", padx=(0, 20))

        # Scrollable container for left panel controls + customize section
        self.left_scroll = ctk.CTkScrollableFrame(
            self.left_panel,
            fg_color="transparent",
            width=360
        ) if CTK_AVAILABLE else tk.Frame(self.left_panel, bg=THEME_COLORS["surface"])
        self.left_scroll.pack(fill="both", expand=True, padx=4, pady=4)

        # Panel Section Header
        panel_title = ctk.CTkLabel(
            self.left_scroll,
            text="QR Creation & Settings",
            font=TYPOGRAPHY["section"],
            text_color=THEME_COLORS["text_primary"]
        ) if CTK_AVAILABLE else tk.Label(self.left_scroll, text="QR Creation & Settings", font=("Segoe UI", 14, "bold"), fg=THEME_COLORS["text_primary"], bg=THEME_COLORS["surface"])
        panel_title.pack(anchor="w", padx=16, pady=(16, 12))

        # 1. URL Input Field (Required)
        url_label = ctk.CTkLabel(
            self.left_scroll,
            text="🌐  URL or Content Target *",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.left_scroll, text="URL Target *", fg=THEME_COLORS["text_secondary"], bg=THEME_COLORS["surface"])
        url_label.pack(anchor="w", padx=16, pady=(0, 4))

        self.url_entry = ctk.CTkEntry(
            self.left_scroll,
            placeholder_text="Paste your URL here...",
            height=42,
            corner_radius=RADII["input"],
            fg_color=THEME_COLORS["glass_card"],
            border_color=THEME_COLORS["border"],
            border_width=1,
            text_color=THEME_COLORS["text_primary"],
            placeholder_text_color=THEME_COLORS["text_muted"],
            font=TYPOGRAPHY["input"]
        ) if CTK_AVAILABLE else tk.Entry(self.left_scroll, font=("Segoe UI", 11))
        self.url_entry.pack(fill="x", padx=16, pady=(0, 12))
        self.url_entry.bind("<KeyRelease>", lambda e: self.on_customization_changed())

        # 2. Filename Input Field
        filename_label = ctk.CTkLabel(
            self.left_scroll,
            text="📄  File Name (Optional)",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.left_scroll, text="File Name", fg=THEME_COLORS["text_secondary"], bg=THEME_COLORS["surface"])
        filename_label.pack(anchor="w", padx=16, pady=(0, 4))

        self.filename_entry = ctk.CTkEntry(
            self.left_scroll,
            placeholder_text="Example: Techbit QR",
            height=42,
            corner_radius=RADII["input"],
            fg_color=THEME_COLORS["glass_card"],
            border_color=THEME_COLORS["border"],
            border_width=1,
            text_color=THEME_COLORS["text_primary"],
            placeholder_text_color=THEME_COLORS["text_muted"],
            font=TYPOGRAPHY["input"]
        ) if CTK_AVAILABLE else tk.Entry(self.left_scroll, font=("Segoe UI", 11))
        self.filename_entry.pack(fill="x", padx=16, pady=(0, 12))

        # 3. Save Folder Selection
        folder_label = ctk.CTkLabel(
            self.left_scroll,
            text="📁  Output Destination",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.left_scroll, text="Output Destination", fg=THEME_COLORS["text_secondary"], bg=THEME_COLORS["surface"])
        folder_label.pack(anchor="w", padx=16, pady=(0, 4))

        folder_frame = ctk.CTkFrame(
            self.left_scroll,
            fg_color="transparent"
        ) if CTK_AVAILABLE else tk.Frame(self.left_scroll, bg=THEME_COLORS["surface"])
        folder_frame.pack(fill="x", padx=16, pady=(0, 16))

        self.folder_display = ctk.CTkEntry(
            folder_frame,
            height=40,
            corner_radius=RADII["input"],
            fg_color=THEME_COLORS["glass_card"],
            border_color=THEME_COLORS["border"],
            border_width=1,
            text_color=THEME_COLORS["text_muted"],
            font=TYPOGRAPHY["status"]
        ) if CTK_AVAILABLE else tk.Entry(folder_frame)
        self.folder_display.insert(0, self.save_directory)
        self.folder_display.configure(state="disabled")
        self.folder_display.pack(side="left", fill="x", expand=True, padx=(0, 8))

        browse_btn = ctk.CTkButton(
            folder_frame,
            text="Browse",
            width=76,
            height=40,
            corner_radius=RADII["button"],
            fg_color=THEME_COLORS["glass_card"],
            hover_color=THEME_COLORS["glass_card_hover"],
            border_width=1,
            border_color=THEME_COLORS["border"],
            text_color=THEME_COLORS["text_primary"],
            font=TYPOGRAPHY["label"],
            command=self.browse_save_folder
        ) if CTK_AVAILABLE else tk.Button(folder_frame, text="Browse", command=self.browse_save_folder)
        browse_btn.pack(side="right")

        # 4. Action Buttons (Generate & Save)
        self.generate_btn = ctk.CTkButton(
            self.left_scroll,
            text="⚡  Generate QR Code",
            height=48,
            corner_radius=RADII["button"],
            fg_color=THEME_COLORS["primary"],
            hover_color=THEME_COLORS["primary_hover"],
            text_color="#FFFFFF",
            font=TYPOGRAPHY["button"],
            command=self.generate_qr_code
        ) if CTK_AVAILABLE else tk.Button(self.left_scroll, text="Generate QR Code", command=self.generate_qr_code)
        self.generate_btn.pack(fill="x", padx=16, pady=(0, 10))

        self.save_btn = ctk.CTkButton(
            self.left_scroll,
            text="💾  Save Image",
            height=44,
            corner_radius=RADII["button"],
            fg_color=THEME_COLORS["glass_card"],
            hover_color=THEME_COLORS["glass_card_hover"],
            border_width=1,
            border_color=THEME_COLORS["border"],
            text_color=THEME_COLORS["text_primary"],
            font=TYPOGRAPHY["button"],
            command=self.save_qr_code
        ) if CTK_AVAILABLE else tk.Button(self.left_scroll, text="Save Image", command=self.save_qr_code)
        self.save_btn.pack(fill="x", padx=16, pady=(0, 16))

        # Visual Separator
        separator = ctk.CTkFrame(
            self.left_scroll,
            height=1,
            fg_color=THEME_COLORS["border"]
        ) if CTK_AVAILABLE else tk.Frame(self.left_scroll, height=1, bg=THEME_COLORS["border"])
        separator.pack(fill="x", padx=16, pady=(0, 16))

        # -------------------------------------------------------------
        # 5. NEW COLLAPSIBLE CARD: "Customize QR"
        # -------------------------------------------------------------
        self._build_customize_section()

        # ------------------- RIGHT PREVIEW PANEL -------------------
        self.right_panel = ctk.CTkFrame(
            self.main_container,
            corner_radius=RADII["preview"],
            fg_color=THEME_COLORS["surface"],
            border_width=1,
            border_color=THEME_COLORS["border"]
        ) if CTK_AVAILABLE else tk.Frame(self.main_container, bg=THEME_COLORS["surface"])
        
        self.right_panel.pack(side="right", fill="both", expand=True)

        # Large Glass Card Preview Frame
        self.preview_card = ctk.CTkFrame(
            self.right_panel,
            width=440,
            height=440,
            corner_radius=RADII["card"],
            fg_color=THEME_COLORS["glass_card"],
            border_width=1,
            border_color=THEME_COLORS["border"]
        ) if CTK_AVAILABLE else tk.Frame(self.right_panel, bg=THEME_COLORS["glass_card"], width=440, height=440)
        
        self.preview_card.pack(expand=True, pady=(32, 16))
        self.preview_card.pack_propagate(False)

        # Empty State Container
        self.empty_state_frame = ctk.CTkFrame(
            self.preview_card,
            fg_color="transparent"
        ) if CTK_AVAILABLE else tk.Frame(self.preview_card, bg=THEME_COLORS["glass_card"])
        self.empty_state_frame.pack(expand=True)

        empty_icon = ctk.CTkLabel(
            self.empty_state_frame,
            text="🔳",
            font=ctk.CTkFont(size=64)
        ) if CTK_AVAILABLE else tk.Label(self.empty_state_frame, text="🔳", font=("Segoe UI", 48), bg=THEME_COLORS["glass_card"], fg=THEME_COLORS["text_muted"])
        empty_icon.pack(pady=(0, 12))

        empty_title = ctk.CTkLabel(
            self.empty_state_frame,
            text="No QR Generated Yet",
            font=TYPOGRAPHY["section"],
            text_color=THEME_COLORS["text_primary"]
        ) if CTK_AVAILABLE else tk.Label(self.empty_state_frame, text="No QR Generated Yet", font=("Segoe UI", 14, "bold"), fg=THEME_COLORS["text_primary"], bg=THEME_COLORS["glass_card"])
        empty_title.pack(pady=(0, 6))

        empty_subtitle = ctk.CTkLabel(
            self.empty_state_frame,
            text="Paste a URL on the left to start customizing live!",
            font=TYPOGRAPHY["subtitle"],
            text_color=THEME_COLORS["text_muted"]
        ) if CTK_AVAILABLE else tk.Label(self.empty_state_frame, text="Paste a URL on the left to start customizing live!", fg=THEME_COLORS["text_muted"], bg=THEME_COLORS["glass_card"])
        empty_subtitle.pack()

        # QR Image Display Label
        self.qr_image_label = ctk.CTkLabel(
            self.preview_card,
            text=""
        ) if CTK_AVAILABLE else tk.Label(self.preview_card, bg=THEME_COLORS["glass_card"])

        # Preview Meta Info Sub-bar
        self.preview_meta_label = ctk.CTkLabel(
            self.right_panel,
            text="",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.right_panel, text="", fg=THEME_COLORS["text_secondary"], bg=THEME_COLORS["surface"])
        self.preview_meta_label.pack(pady=(0, 24))

    def _build_customize_section(self):
        """Constructs the collapsible 'Customize QR' section with all 12 controls."""
        self.customize_card = ctk.CTkFrame(
            self.left_scroll,
            corner_radius=RADII["card"],
            fg_color=THEME_COLORS["glass_card"],
            border_width=1,
            border_color=THEME_COLORS["border"]
        ) if CTK_AVAILABLE else tk.Frame(self.left_scroll, bg=THEME_COLORS["glass_card"])
        self.customize_card.pack(fill="x", padx=16, pady=(0, 16))

        # Collapsible Header Toggle Button
        self.customize_toggle_btn = ctk.CTkButton(
            self.customize_card,
            text="🎨  Customize QR   ►",
            anchor="w",
            height=46,
            corner_radius=RADII["card"],
            fg_color="transparent",
            hover_color=THEME_COLORS["glass_card_hover"],
            text_color=THEME_COLORS["text_primary"],
            font=TYPOGRAPHY["section"],
            command=self.toggle_customize_section
        ) if CTK_AVAILABLE else tk.Button(self.customize_card, text="🎨 Customize QR ►", command=self.toggle_customize_section)
        self.customize_toggle_btn.pack(fill="x", padx=8, pady=6)

        # Expandable Content Container (Hidden initially)
        self.customize_content = ctk.CTkFrame(
            self.customize_card,
            fg_color="transparent"
        ) if CTK_AVAILABLE else tk.Frame(self.customize_card, bg=THEME_COLORS["glass_card"])

        # -------------------------------------------------------------
        # 11 & 12. Presets Bar & Reset Design Button
        # -------------------------------------------------------------
        presets_label = ctk.CTkLabel(
            self.customize_content,
            text="⭐  Style Presets",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="Style Presets", fg=THEME_COLORS["text_secondary"], bg=THEME_COLORS["glass_card"])
        presets_label.pack(anchor="w", padx=4, pady=(8, 4))

        presets_frame = ctk.CTkFrame(self.customize_content, fg_color="transparent") if CTK_AVAILABLE else tk.Frame(self.customize_content)
        presets_frame.pack(fill="x", pady=(0, 12))

        for preset_name in ["Classic", "Minimal", "Business", "Modern", "Premium"]:
            btn = ctk.CTkButton(
                presets_frame,
                text=preset_name,
                width=62,
                height=32,
                corner_radius=10,
                fg_color=THEME_COLORS["surface"],
                hover_color=THEME_COLORS["primary_disabled"],
                border_width=1,
                border_color=THEME_COLORS["border"],
                text_color=THEME_COLORS["text_primary"],
                font=TYPOGRAPHY["status"],
                command=lambda p=preset_name: self.apply_preset(p)
            ) if CTK_AVAILABLE else tk.Button(presets_frame, text=preset_name, command=lambda p=preset_name: self.apply_preset(p))
            btn.pack(side="left", padx=2, expand=True)

        reset_btn = ctk.CTkButton(
            self.customize_content,
            text="↺  Reset Design Defaults",
            height=36,
            corner_radius=RADII["button"],
            fg_color=THEME_COLORS["surface"],
            hover_color=THEME_COLORS["glass_card_hover"],
            border_width=1,
            border_color=THEME_COLORS["border"],
            text_color=THEME_COLORS["warning"],
            font=TYPOGRAPHY["status"],
            command=self.reset_customization
        ) if CTK_AVAILABLE else tk.Button(self.customize_content, text="Reset Design Defaults", command=self.reset_customization)
        reset_btn.pack(fill="x", pady=(0, 14))

        # -------------------------------------------------------------
        # 1. QR Style Dropdown
        # -------------------------------------------------------------
        style_label = ctk.CTkLabel(
            self.customize_content,
            text="🔷  QR Style",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="QR Style")
        style_label.pack(anchor="w", padx=4, pady=(0, 4))

        self.style_dropdown = ctk.CTkOptionMenu(
            self.customize_content,
            values=QR_STYLES,
            height=36,
            corner_radius=RADII["input"],
            fg_color=THEME_COLORS["surface"],
            button_color=THEME_COLORS["border"],
            button_hover_color=THEME_COLORS["primary"],
            text_color=THEME_COLORS["text_primary"],
            command=lambda v: self._on_ui_param_changed("style", v)
        ) if CTK_AVAILABLE else tk.OptionMenu(self.customize_content, tk.StringVar(), *QR_STYLES)
        self.style_dropdown.set(self.custom_config.style) if CTK_AVAILABLE else None
        self.style_dropdown.pack(fill="x", pady=(0, 12))

        # -------------------------------------------------------------
        # 2 & 3. Colors: Foreground, Background & Transparent Toggle
        # -------------------------------------------------------------
        colors_header = ctk.CTkLabel(
            self.customize_content,
            text="🎨  Foreground & Background Colors",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="Colors")
        colors_header.pack(anchor="w", padx=4, pady=(0, 4))

        color_row = ctk.CTkFrame(self.customize_content, fg_color="transparent") if CTK_AVAILABLE else tk.Frame(self.customize_content)
        color_row.pack(fill="x", pady=(0, 8))

        # FG Swatch Button
        self.fg_swatch = ctk.CTkButton(
            color_row,
            text="FG Color",
            height=34,
            fg_color=self.custom_config.fg_color,
            hover_color=THEME_COLORS["border_focus"],
            border_width=1,
            border_color=THEME_COLORS["border"],
            text_color="#FFFFFF" if self.custom_config.fg_color in ("#000000", "#0F172A") else "#000000",
            command=self.choose_fg_color
        ) if CTK_AVAILABLE else tk.Button(color_row, text="FG Color", command=self.choose_fg_color)
        self.fg_swatch.pack(side="left", fill="x", expand=True, padx=(0, 4))

        # BG Swatch Button
        self.bg_swatch = ctk.CTkButton(
            color_row,
            text="BG Color",
            height=34,
            fg_color=self.custom_config.bg_color,
            hover_color=THEME_COLORS["border_focus"],
            border_width=1,
            border_color=THEME_COLORS["border"],
            text_color="#000000" if self.custom_config.bg_color == "#FFFFFF" else "#FFFFFF",
            command=self.choose_bg_color
        ) if CTK_AVAILABLE else tk.Button(color_row, text="BG Color", command=self.choose_bg_color)
        self.bg_swatch.pack(side="right", fill="x", expand=True, padx=(4, 0))

        # Transparent Background Switch / Checkbox
        self.trans_switch = ctk.CTkSwitch(
            self.customize_content,
            text="Transparent Background",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_secondary"],
            progress_color=THEME_COLORS["primary"],
            command=self._on_transparent_toggled
        ) if CTK_AVAILABLE else tk.Checkbutton(self.customize_content, text="Transparent Background")
        self.trans_switch.pack(anchor="w", padx=4, pady=(0, 12))

        # -------------------------------------------------------------
        # 4. Gradient Toggle & Controls
        # -------------------------------------------------------------
        self.gradient_switch = ctk.CTkSwitch(
            self.customize_content,
            text="Enable Gradient Modules",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_secondary"],
            progress_color=THEME_COLORS["primary"],
            command=self._on_gradient_toggled
        ) if CTK_AVAILABLE else tk.Checkbutton(self.customize_content, text="Enable Gradient Modules")
        self.gradient_switch.pack(anchor="w", padx=4, pady=(0, 6))

        self.gradient_row = ctk.CTkFrame(self.customize_content, fg_color="transparent") if CTK_AVAILABLE else tk.Frame(self.customize_content)
        
        self.grad_start_swatch = ctk.CTkButton(
            self.gradient_row,
            text="Start Color",
            height=32,
            fg_color=self.custom_config.gradient_start,
            command=self.choose_gradient_start
        ) if CTK_AVAILABLE else tk.Button(self.gradient_row, text="Start Color", command=self.choose_gradient_start)
        self.grad_start_swatch.pack(side="left", fill="x", expand=True, padx=(0, 4))

        self.grad_end_swatch = ctk.CTkButton(
            self.gradient_row,
            text="End Color",
            height=32,
            fg_color=self.custom_config.gradient_end,
            command=self.choose_gradient_end
        ) if CTK_AVAILABLE else tk.Button(self.gradient_row, text="End Color", command=self.choose_gradient_end)
        self.grad_end_swatch.pack(side="right", fill="x", expand=True, padx=(4, 0))

        # -------------------------------------------------------------
        # 5 & 6. Eye Style & Eye Color
        # -------------------------------------------------------------
        eye_label = ctk.CTkLabel(
            self.customize_content,
            text="👁️  Eye Corner Style & Color",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="Eye Style & Color")
        eye_label.pack(anchor="w", padx=4, pady=(12, 4))

        self.eye_dropdown = ctk.CTkOptionMenu(
            self.customize_content,
            values=EYE_STYLES,
            height=36,
            corner_radius=RADII["input"],
            fg_color=THEME_COLORS["surface"],
            button_color=THEME_COLORS["border"],
            button_hover_color=THEME_COLORS["primary"],
            text_color=THEME_COLORS["text_primary"],
            command=lambda v: self._on_ui_param_changed("eye_style", v)
        ) if CTK_AVAILABLE else tk.OptionMenu(self.customize_content, tk.StringVar(), *EYE_STYLES)
        self.eye_dropdown.set(self.custom_config.eye_style) if CTK_AVAILABLE else None
        self.eye_dropdown.pack(fill="x", pady=(0, 8))

        eye_color_row = ctk.CTkFrame(self.customize_content, fg_color="transparent") if CTK_AVAILABLE else tk.Frame(self.customize_content)
        eye_color_row.pack(fill="x", pady=(0, 12))

        self.eye_color_swatch = ctk.CTkButton(
            eye_color_row,
            text="Eye Color (Custom)",
            height=32,
            fg_color=self.custom_config.eye_color if self.custom_config.eye_color else THEME_COLORS["surface"],
            command=self.choose_eye_color
        ) if CTK_AVAILABLE else tk.Button(eye_color_row, text="Eye Color", command=self.choose_eye_color)
        self.eye_color_swatch.pack(side="left", fill="x", expand=True, padx=(0, 4))

        clear_eye_btn = ctk.CTkButton(
            eye_color_row,
            text="Match FG",
            width=76,
            height=32,
            fg_color=THEME_COLORS["surface"],
            command=self.clear_eye_color
        ) if CTK_AVAILABLE else tk.Button(eye_color_row, text="Match FG", command=self.clear_eye_color)
        clear_eye_btn.pack(side="right")

        # -------------------------------------------------------------
        # 7. Logo Controls (Upload, Remove, Size Slider, Shape)
        # -------------------------------------------------------------
        logo_label = ctk.CTkLabel(
            self.customize_content,
            text="🖼️  Center Logo Overlay",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="Center Logo")
        logo_label.pack(anchor="w", padx=4, pady=(0, 4))

        logo_btn_row = ctk.CTkFrame(self.customize_content, fg_color="transparent") if CTK_AVAILABLE else tk.Frame(self.customize_content)
        logo_btn_row.pack(fill="x", pady=(0, 8))

        upload_logo_btn = ctk.CTkButton(
            logo_btn_row,
            text="📁 Upload Logo",
            height=34,
            fg_color=THEME_COLORS["surface"],
            hover_color=THEME_COLORS["primary_disabled"],
            border_width=1,
            border_color=THEME_COLORS["border"],
            command=self.upload_logo
        ) if CTK_AVAILABLE else tk.Button(logo_btn_row, text="Upload Logo", command=self.upload_logo)
        upload_logo_btn.pack(side="left", fill="x", expand=True, padx=(0, 4))

        remove_logo_btn = ctk.CTkButton(
            logo_btn_row,
            text="✖ Remove",
            width=84,
            height=34,
            fg_color=THEME_COLORS["surface"],
            hover_color=THEME_COLORS["glass_card_hover"],
            border_width=1,
            border_color=THEME_COLORS["border"],
            text_color=THEME_COLORS["error"],
            command=self.remove_logo
        ) if CTK_AVAILABLE else tk.Button(logo_btn_row, text="Remove", command=self.remove_logo)
        remove_logo_btn.pack(side="right")

        self.logo_status_label = ctk.CTkLabel(
            self.customize_content,
            text="No logo loaded",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_muted"]
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="No logo loaded")
        self.logo_status_label.pack(anchor="w", padx=4, pady=(0, 6))

        # Logo Size Slider (10% to 40%)
        logo_size_header = ctk.CTkFrame(self.customize_content, fg_color="transparent") if CTK_AVAILABLE else tk.Frame(self.customize_content)
        logo_size_header.pack(fill="x")
        
        logo_size_title = ctk.CTkLabel(
            logo_size_header,
            text="Logo Size Scale",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(logo_size_header, text="Logo Size Scale")
        logo_size_title.pack(side="left", padx=4)

        self.logo_size_val_label = ctk.CTkLabel(
            logo_size_header,
            text="20%",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["primary"]
        ) if CTK_AVAILABLE else tk.Label(logo_size_header, text="20%")
        self.logo_size_val_label.pack(side="right", padx=4)

        self.logo_size_slider = ctk.CTkSlider(
            self.customize_content,
            from_=0.10,
            to=0.40,
            number_of_steps=30,
            command=self._on_logo_size_slider_changed
        ) if CTK_AVAILABLE else tk.Scale(self.customize_content, from_=10, to=40, orient="horizontal")
        self.logo_size_slider.set(self.custom_config.logo_size) if CTK_AVAILABLE else None
        self.logo_size_slider.pack(fill="x", pady=(0, 10))

        # Logo Shape Dropdown
        logo_shape_label = ctk.CTkLabel(
            self.customize_content,
            text="Logo Clipping Mask Shape",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="Logo Shape")
        logo_shape_label.pack(anchor="w", padx=4, pady=(0, 4))

        self.logo_shape_dropdown = ctk.CTkOptionMenu(
            self.customize_content,
            values=LOGO_SHAPES,
            height=34,
            corner_radius=RADII["input"],
            fg_color=THEME_COLORS["surface"],
            button_color=THEME_COLORS["border"],
            button_hover_color=THEME_COLORS["primary"],
            text_color=THEME_COLORS["text_primary"],
            command=lambda v: self._on_ui_param_changed("logo_shape", v)
        ) if CTK_AVAILABLE else tk.OptionMenu(self.customize_content, tk.StringVar(), *LOGO_SHAPES)
        self.logo_shape_dropdown.set(self.custom_config.logo_shape) if CTK_AVAILABLE else None
        self.logo_shape_dropdown.pack(fill="x", pady=(0, 14))

        # -------------------------------------------------------------
        # 8 & 9. QR Size & Margin Sliders
        # -------------------------------------------------------------
        qr_size_header = ctk.CTkFrame(self.customize_content, fg_color="transparent") if CTK_AVAILABLE else tk.Frame(self.customize_content)
        qr_size_header.pack(fill="x")
        
        qr_size_title = ctk.CTkLabel(
            qr_size_header,
            text="📏 Target Resolution (px)",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(qr_size_header, text="Target Resolution")
        qr_size_title.pack(side="left", padx=4)

        self.qr_size_val_label = ctk.CTkLabel(
            qr_size_header,
            text="512 px",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["primary"]
        ) if CTK_AVAILABLE else tk.Label(qr_size_header, text="512 px")
        self.qr_size_val_label.pack(side="right", padx=4)

        self.qr_size_slider = ctk.CTkSlider(
            self.customize_content,
            from_=256,
            to=2048,
            number_of_steps=7,
            command=self._on_qr_size_slider_changed
        ) if CTK_AVAILABLE else tk.Scale(self.customize_content, from_=256, to=2048, orient="horizontal")
        self.qr_size_slider.set(self.custom_config.qr_size) if CTK_AVAILABLE else None
        self.qr_size_slider.pack(fill="x", pady=(0, 10))

        margin_header = ctk.CTkFrame(self.customize_content, fg_color="transparent") if CTK_AVAILABLE else tk.Frame(self.customize_content)
        margin_header.pack(fill="x")

        margin_title = ctk.CTkLabel(
            margin_header,
            text="📦 Quiet Zone Margin",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(margin_header, text="Margin")
        margin_title.pack(side="left", padx=4)

        self.margin_val_label = ctk.CTkLabel(
            margin_header,
            text="4 modules",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["primary"]
        ) if CTK_AVAILABLE else tk.Label(margin_header, text="4 modules")
        self.margin_val_label.pack(side="right", padx=4)

        self.margin_slider = ctk.CTkSlider(
            self.customize_content,
            from_=0,
            to=5,
            number_of_steps=5,
            command=self._on_margin_slider_changed
        ) if CTK_AVAILABLE else tk.Scale(self.customize_content, from_=0, to=5, orient="horizontal")
        self.margin_slider.set(self.custom_config.margin) if CTK_AVAILABLE else None
        self.margin_slider.pack(fill="x", pady=(0, 14))

        # -------------------------------------------------------------
        # 10. Error Correction Dropdown + Helper Text
        # -------------------------------------------------------------
        ec_label = ctk.CTkLabel(
            self.customize_content,
            text="🛡️  Error Correction Level",
            font=TYPOGRAPHY["label"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="Error Correction Level")
        ec_label.pack(anchor="w", padx=4, pady=(0, 4))

        ec_options = [opt[0] for opt in ERROR_CORRECTION_OPTIONS]
        self.ec_dropdown = ctk.CTkOptionMenu(
            self.customize_content,
            values=ec_options,
            height=34,
            corner_radius=RADII["input"],
            fg_color=THEME_COLORS["surface"],
            button_color=THEME_COLORS["border"],
            button_hover_color=THEME_COLORS["primary"],
            text_color=THEME_COLORS["text_primary"],
            command=self._on_ec_dropdown_changed
        ) if CTK_AVAILABLE else tk.OptionMenu(self.customize_content, tk.StringVar(), *ec_options)
        self.ec_dropdown.set("Medium (15%)") if CTK_AVAILABLE else None
        self.ec_dropdown.pack(fill="x", pady=(0, 4))

        ec_help = ctk.CTkLabel(
            self.customize_content,
            text="ℹ️ Higher recovery levels ensure QR scanability when logos or custom shapes are applied.",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_muted"],
            wraplength=320,
            justify="left"
        ) if CTK_AVAILABLE else tk.Label(self.customize_content, text="Higher recovery levels ensure QR scanability.")
        ec_help.pack(anchor="w", padx=4, pady=(0, 12))

    # -------------------------------------------------------------
    # CUSTOMIZATION EVENT HANDLERS & HELPERS
    # -------------------------------------------------------------
    def _on_theme_segment_changed(self, value):
        """Handler for segmented header theme mode toggle button."""
        mode = "Light" if "Bright" in value else "Dark"
        self.toggle_appearance_mode(mode)

    def toggle_appearance_mode(self, mode=None):
        """Toggle between Dark and Bright (Light) appearance mode."""
        if mode is None:
            mode = "Light" if self.current_appearance == "Dark" else "Dark"

        self.current_appearance = mode
        if CTK_AVAILABLE:
            ctk.set_appearance_mode(mode)
            if hasattr(self, "theme_segment"):
                val = "☀️ Bright" if mode == "Light" else "🌙 Dark"
                self.theme_segment.set(val)

        mode_name = "Bright" if mode == "Light" else "Dark"
        self.show_toast(f"Switched to {mode_name} Mode", toast_type="success")
    def toggle_customize_section(self):
        """Toggle expanding or collapsing the 'Customize QR' section."""
        self.customize_expanded = not self.customize_expanded
        if self.customize_expanded:
            self.customize_content.pack(fill="x", padx=12, pady=(0, 16))
            if CTK_AVAILABLE:
                self.customize_toggle_btn.configure(text="🎨  Customize QR   ▲")
            else:
                self.customize_toggle_btn.config(text="🎨 Customize QR ▲")
        else:
            self.customize_content.pack_forget()
            if CTK_AVAILABLE:
                self.customize_toggle_btn.configure(text="🎨  Customize QR   ▼")
            else:
                self.customize_toggle_btn.config(text="🎨 Customize QR ▼")

    def _set_button_colors(self, button, bg_color=None, text_color=None):
        """Helper to safely configure button background/foreground colors for CTk and Tk widgets."""
        if not button:
            return
        if CTK_AVAILABLE and isinstance(button, ctk.CTkButton):
            kwargs = {}
            if bg_color is not None:
                kwargs["fg_color"] = bg_color
            if text_color is not None:
                kwargs["text_color"] = text_color
            button.configure(**kwargs)
        elif isinstance(button, tk.Button):
            kwargs = {}
            if bg_color is not None:
                kwargs["bg"] = bg_color
            if text_color is not None:
                kwargs["fg"] = text_color
            button.config(**kwargs)

    def _set_label_text(self, label, text=None, text_color=None):
        """Helper to safely configure label text and text_color for CTk and Tk widgets."""
        if not label:
            return
        if CTK_AVAILABLE and isinstance(label, ctk.CTkLabel):
            kwargs = {}
            if text is not None:
                kwargs["text"] = text
            if text_color is not None:
                kwargs["text_color"] = text_color
            label.configure(**kwargs)
        elif isinstance(label, tk.Label):
            kwargs = {}
            if text is not None:
                kwargs["text"] = text
            if text_color is not None:
                kwargs["fg"] = text_color
            label.config(**kwargs)

    def _sync_customization_ui(self):
        """Synchronize all UI controls with self.custom_config values."""
        if not CTK_AVAILABLE:
            return

        self.style_dropdown.set(self.custom_config.style)
        self.eye_dropdown.set(self.custom_config.eye_style)
        self.logo_shape_dropdown.set(self.custom_config.logo_shape)

        self._set_button_colors(
            self.fg_swatch,
            bg_color=self.custom_config.fg_color,
            text_color="#FFFFFF" if self.custom_config.fg_color in ("#000000", "#0F172A") else "#000000"
        )
        self._set_button_colors(
            self.bg_swatch,
            bg_color=self.custom_config.bg_color,
            text_color="#000000" if self.custom_config.bg_color == "#FFFFFF" else "#FFFFFF"
        )

        if self.custom_config.transparent_bg:
            self.trans_switch.select()
        else:
            self.trans_switch.deselect()

        if self.custom_config.gradient_enabled:
            self.gradient_switch.select()
            self.gradient_row.pack(fill="x", pady=(0, 12))
        else:
            self.gradient_switch.deselect()
            self.gradient_row.pack_forget()

        self._set_button_colors(self.grad_start_swatch, bg_color=self.custom_config.gradient_start)
        self._set_button_colors(self.grad_end_swatch, bg_color=self.custom_config.gradient_end)

        eye_col = self.custom_config.eye_color if self.custom_config.eye_color else THEME_COLORS["surface"]
        self._set_button_colors(self.eye_color_swatch, bg_color=eye_col)

        if self.custom_config.logo_path and os.path.exists(self.custom_config.logo_path):
            basename = os.path.basename(self.custom_config.logo_path)
            self._set_label_text(self.logo_status_label, text=f"Loaded: {basename[:20]}...", text_color=THEME_COLORS["success"])
        else:
            self._set_label_text(self.logo_status_label, text="No logo loaded", text_color=THEME_COLORS["text_muted"])

        self.logo_size_slider.set(self.custom_config.logo_size)
        self._set_label_text(self.logo_size_val_label, text=f"{int(self.custom_config.logo_size * 100)}%")

        self.qr_size_slider.set(self.custom_config.qr_size)
        self._set_label_text(self.qr_size_val_label, text=f"{int(self.custom_config.qr_size)} px")

        self.margin_slider.set(self.custom_config.margin)
        self._set_label_text(self.margin_val_label, text=f"{int(self.custom_config.margin)} modules")

        for label, val in ERROR_CORRECTION_OPTIONS:
            if val == self.custom_config.error_correction:
                self.ec_dropdown.set(label)
                break

    def choose_fg_color(self):
        color = colorchooser.askcolor(initialcolor=self.custom_config.fg_color, title="Select Foreground Color")
        if color and color[1]:
            self.custom_config.fg_color = color[1]
            self._sync_customization_ui()
            self.on_customization_changed()

    def choose_bg_color(self):
        color = colorchooser.askcolor(initialcolor=self.custom_config.bg_color, title="Select Background Color")
        if color and color[1]:
            self.custom_config.bg_color = color[1]
            self._sync_customization_ui()
            self.on_customization_changed()

    def _on_transparent_toggled(self):
        if CTK_AVAILABLE:
            self.custom_config.transparent_bg = bool(self.trans_switch.get())
        self.on_customization_changed()

    def _on_gradient_toggled(self):
        if CTK_AVAILABLE:
            self.custom_config.gradient_enabled = bool(self.gradient_switch.get())
        self._sync_customization_ui()
        self.on_customization_changed()

    def choose_gradient_start(self):
        color = colorchooser.askcolor(initialcolor=self.custom_config.gradient_start, title="Select Gradient Start Color")
        if color and color[1]:
            self.custom_config.gradient_start = color[1]
            self._sync_customization_ui()
            self.on_customization_changed()

    def choose_gradient_end(self):
        color = colorchooser.askcolor(initialcolor=self.custom_config.gradient_end, title="Select Gradient End Color")
        if color and color[1]:
            self.custom_config.gradient_end = color[1]
            self._sync_customization_ui()
            self.on_customization_changed()

    def choose_eye_color(self):
        init_c = self.custom_config.eye_color or self.custom_config.fg_color
        color = colorchooser.askcolor(initialcolor=init_c, title="Select Eye Pattern Color")
        if color and color[1]:
            self.custom_config.eye_color = color[1]
            self._sync_customization_ui()
            self.on_customization_changed()

    def clear_eye_color(self):
        self.custom_config.eye_color = None
        self._sync_customization_ui()
        self.on_customization_changed()

    def upload_logo(self):
        file_path = filedialog.askopenfilename(
            title="Select Logo Image",
            filetypes=[("Image Files", "*.png *.jpg *.jpeg *.svg *.bmp *.webp")]
        )
        if file_path:
            self.custom_config.logo_path = file_path
            self._sync_customization_ui()
            self.show_toast("Logo loaded successfully!", toast_type="success")
            self.on_customization_changed()

    def remove_logo(self):
        self.custom_config.logo_path = None
        self._sync_customization_ui()
        self.show_toast("Logo removed", toast_type="warning")
        self.on_customization_changed()

    def _on_logo_size_slider_changed(self, value):
        self.custom_config.logo_size = float(value)
        if CTK_AVAILABLE:
            self.logo_size_val_label.configure(text=f"{int(float(value)*100)}%")
        self.on_customization_changed()

    def _on_qr_size_slider_changed(self, value):
        val_int = int(value)
        self.custom_config.qr_size = val_int
        if CTK_AVAILABLE:
            self.qr_size_val_label.configure(text=f"{val_int} px")
            self.spec_label.configure(text=f"Format: PNG  |  Target Resolution: {val_int} × {val_int} px")
        self.on_customization_changed()

    def _on_margin_slider_changed(self, value):
        val_int = int(value)
        self.custom_config.margin = val_int
        if CTK_AVAILABLE:
            self.margin_val_label.configure(text=f"{val_int} modules")
        self.on_customization_changed()

    def _on_ec_dropdown_changed(self, label):
        for opt_label, val in ERROR_CORRECTION_OPTIONS:
            if opt_label == label:
                self.custom_config.error_correction = val
                break
        self.on_customization_changed()

    def _on_ui_param_changed(self, param_name, value):
        setattr(self.custom_config, param_name, value)
        self.on_customization_changed()

    def apply_preset(self, preset_name):
        self.custom_config.apply_preset(preset_name)
        self._sync_customization_ui()
        self.show_toast(f"Applied '{preset_name}' Preset!", toast_type="success")
        self.on_customization_changed()

    def reset_customization(self):
        self.custom_config.reset()
        self._sync_customization_ui()
        self.show_toast("Design reset to default!", toast_type="warning")
        self.on_customization_changed()

    def on_customization_changed(self, *args):
        """Triggered automatically whenever any customization control changes for instant Live Preview."""
        raw_url = self.url_entry.get().strip()
        if raw_url:
            self.generate_qr_code()

    # -------------------------------------------------------------
    # CORE ACTION METHODS
    # -------------------------------------------------------------
    def _build_status_bar(self):
        """Bottom Status Bar (PRD Section 16)."""
        self.status_bar = ctk.CTkFrame(
            self,
            corner_radius=0,
            fg_color=THEME_COLORS["surface"],
            height=36
        ) if CTK_AVAILABLE else tk.Frame(self, bg=THEME_COLORS["surface"], height=36)
        
        self.status_bar.pack(side="bottom", fill="x")
        self.status_bar.pack_propagate(False)

        # Left Status Indicator
        self.status_label = ctk.CTkLabel(
            self.status_bar,
            text="● Ready",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_secondary"]
        ) if CTK_AVAILABLE else tk.Label(self.status_bar, text="● Ready", fg=THEME_COLORS["text_secondary"], bg=THEME_COLORS["surface"])
        self.status_label.pack(side="left", padx=24, pady=8)

        # Right Specification Info
        self.spec_label = ctk.CTkLabel(
            self.status_bar,
            text=f"Format: PNG  |  Target Resolution: {self.custom_config.qr_size} × {self.custom_config.qr_size} px",
            font=TYPOGRAPHY["status"],
            text_color=THEME_COLORS["text_muted"]
        ) if CTK_AVAILABLE else tk.Label(self.status_bar, text="Format: PNG", fg=THEME_COLORS["text_muted"], bg=THEME_COLORS["surface"])
        self.spec_label.pack(side="right", padx=24, pady=8)

    def update_status(self, text, color=None):
        """Helper to update status label text and color across CustomTkinter and Tkinter."""
        if CTK_AVAILABLE:
            kwargs = {"text": text}
            if color:
                kwargs["text_color"] = color
            self.status_label.configure(**kwargs)
        else:
            kwargs = {"text": text}
            if color:
                kwargs["fg"] = color
            self.status_label.config(**kwargs)

    def set_ui_state(self, state):
        """Manages application state transitions (PRD Section 24)."""
        if state == "idle":
            self.empty_state_frame.pack(expand=True)
            self.qr_image_label.pack_forget()
            self.save_btn.configure(state="disabled") if CTK_AVAILABLE else self.save_btn.config(state="disabled")
            self.update_status("● Ready", THEME_COLORS["text_secondary"])
            self.preview_meta_label.configure(text="") if CTK_AVAILABLE else self.preview_meta_label.config(text="")

        elif state == "generating":
            self.generate_btn.configure(state="disabled") if CTK_AVAILABLE else self.generate_btn.config(state="disabled")
            self.update_status("⚡ Generating QR Code...", THEME_COLORS["primary"])

        elif state == "ready":
            self.empty_state_frame.pack_forget()
            self.qr_image_label.pack(expand=True, padx=20, pady=20)
            self.generate_btn.configure(state="normal") if CTK_AVAILABLE else self.generate_btn.config(state="normal")
            self.save_btn.configure(state="normal") if CTK_AVAILABLE else self.save_btn.config(state="normal")
            self.update_status("✔ QR Code Generated", THEME_COLORS["success"])

    def show_toast(self, message, toast_type="success"):
        """Displays slide-in toast notification (PRD Section 17)."""
        if self.active_toast:
            self.active_toast.dismiss()
        self.active_toast = ToastNotification(self, message, toast_type=toast_type)
        self.active_toast.show()

    def browse_save_folder(self):
        """Opens native folder selection dialog."""
        folder = filedialog.askdirectory(initialdir=self.save_directory)
        if folder:
            self.save_directory = folder
            self.folder_display.configure(state="normal") if CTK_AVAILABLE else self.folder_display.config(state="normal")
            self.folder_display.delete(0, "end")
            self.folder_display.insert(0, self.save_directory)
            self.folder_display.configure(state="disabled") if CTK_AVAILABLE else self.folder_display.config(state="disabled")
            self.show_toast("Output folder updated!", toast_type="success")

    def generate_qr_code(self):
        """Generates QR code from user input and custom config with performance benchmarking."""
        raw_url = self.url_entry.get().strip()
        
        if not raw_url:
            self.show_toast("Please paste a URL first!", toast_type="warning")
            self.update_status("✖ URL Required", THEME_COLORS["error"])
            return

        self.set_ui_state("generating")
        self.update_idletasks()

        try:
            # Generate QR Image using custom configuration model
            pil_img, elapsed = QREngine.generate_qr_with_benchmark(
                data=raw_url,
                config=self.custom_config
            )
            
            self.current_qr_image = pil_img
            self.current_qr_benchmark = elapsed

            # Resize PIL image for crisp display in 380x380 preview container
            display_img = pil_img.copy()
            display_img.thumbnail((380, 380), Image.Resampling.LANCZOS)
            
            if CTK_AVAILABLE:
                ctk_img = ctk.CTkImage(light_image=display_img, dark_image=display_img, size=(380, 380))
                self.qr_image_label.configure(image=ctk_img)
            else:
                tk_img = ImageTk.PhotoImage(display_img)
                self.qr_image_label.configure(image=tk_img)
                self.qr_image_label.image = tk_img

            self.set_ui_state("ready")
            
            # Update meta info microcopy
            style_name = self.custom_config.style
            meta_text = f"Style: {style_name}   •   Res: {pil_img.width} × {pil_img.height} px   •   Speed: {elapsed:.3f} s"
            self.preview_meta_label.configure(text=meta_text) if CTK_AVAILABLE else self.preview_meta_label.config(text=meta_text)
            
            # Save to history manager
            self.history_manager.add_entry(raw_url, "URL", elapsed)

        except Exception as err:
            self.generate_btn.configure(state="normal") if CTK_AVAILABLE else None
            self.update_status("✖ Generation Failed", THEME_COLORS["error"])
            self.show_toast(f"Failed to generate: {err}", toast_type="error")

    def save_qr_code(self):
        """Saves current QR code image to selected folder."""
        if not self.current_qr_image:
            self.show_toast("No QR Code available to save!", toast_type="warning")
            return

        filename = self.filename_entry.get().strip()
        if not filename:
            filename = f"QR_Canvas_{int(time.time())}"
        
        if not filename.lower().endswith(".png"):
            filename += ".png"

        save_path = os.path.join(self.save_directory, filename)

        try:
            # Save high-resolution PNG
            self.current_qr_image.save(save_path, "PNG")
            
            status_text = f"✔ Saved: {filename}"
            self.update_status(status_text, THEME_COLORS["success"])
            self.show_toast(f"Saved to {filename}", toast_type="success")

        except Exception as err:
            self.show_toast(f"Failed to save image: {err}", toast_type="error")


if __name__ == "__main__":
    app = QRCanvasApp()
    app.mainloop()
