# QR Canvas Studio — Modern SaaS Platform

> **Tagline**: Create Beautiful QR Codes Effortlessly.  
> **Product Vision**: A premium web-based QR Design Studio inspired by Canva, Linear, Raycast, Apple, Arc Browser, and Stripe Dashboard.

---

## ✨ Key Features & Architecture

- **Sub-16ms Real-Time Live Preview**: Zero-latency interactive SVG vector canvas rendering engine.
- **13+ QR Payload Types**: URL, WiFi, vCard 4.0, Text, Email, Phone, SMS, WhatsApp, iCal Events, Geo Location, Social Multi-link, PDF, App Store, UPI Payments.
- **Module Shapes**: Square, Rounded, Dots, Diamond, Bubble, Circle, Hexagon.
- **Eye Customization**: Custom outer/inner eye frames and eye-specific color overrides.
- **Gradients & Colors**: Dual-stop linear & radial gradients, solid colors, transparent background support.
- **Brand Logo Overlay**: High-fidelity logo upload, scale control, margin protection, background removal.
- **Call-to-Action Frames**: Top & Bottom badges with custom text ("Scan Me", "View Menu", "Connect WiFi").
- **Studio Templates Gallery**: Pre-built curated presets (Linear Tech, Gourmet Menu, Cyber WiFi, Stripe Minimal, Creator Sunset, Wedding RSVP).
- **History & Favorites**: Auto-saving design workspace with search, filter, star favorites, duplicate, and persistent storage.
- **Export Engine**: High-resolution PNG (up to 4096px), crisp vector SVG, and print-ready PDF document generator.
- **Global Command Palette (`Ctrl+K` / `Cmd+K`)**: Quick launcher for instant payload switches, template browsing, and export.
- **Keyboard Shortcuts**: Quick Save (`Ctrl+S`), Command Palette (`Ctrl+K`).

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v4 + Glassmorphism UI tokens
- **Icons**: Lucide Icons
- **State Management**: Zustand with persistent storage
- **Animations**: Framer Motion & Canvas Confetti
- **Document Export**: jsPDF & HTML5 Canvas

### Backend
- **Framework**: FastAPI (Python 3.14)
- **Engine**: Segno (SVG Vector Generator) & Pillow (Raster Image Processing)
- **Validation**: Pydantic v2
- **ORMs/DB**: SQLAlchemy 2.0 & PostgreSQL ready

---

## 🚀 Quick Start Guide

### Option A: Standard CLI Launch

1. **Start Backend**:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   python -m uvicorn app.main:app --reload --port 8000
   ```

2. **Start Frontend Studio**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open **`http://localhost:5173`** in your browser!

### Option B: Windows One-Click Launcher

Simply double-click **`run_dev.bat`** in the project root directory to launch both the FastAPI backend and Vite frontend studio automatically!

---

## 📄 Documentation & Artifacts

- Technical Implementation Plan & Product Architecture: **[`implementation_plan.md`](file:///C:/Users/Pradeep/.gemini/antigravity/brain/e9f6238f-3af2-4a3e-a78f-209fa029297e/implementation_plan.md)**
