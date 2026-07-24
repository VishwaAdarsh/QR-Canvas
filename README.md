# QR Canvas

A modern web application for creating, customizing, and exporting QR codes with a real-time design interface.

QR Canvas provides multiple QR code types, customizable styles, templates, and export options through a clean and responsive user interface.

---

## Preview

> Add screenshots or GIFs here after deployment.

| Home | QR Studio |
|------|-----------|
| ![Home](docs/screenshots/home.png) | ![Studio](docs/screenshots/studio.png) |

---

# Features

### QR Payload Types

- URL / Website
- Plain Text
- WiFi Network
- Email
- Phone Call
- SMS
- WhatsApp
- vCard Contact
- Calendar Event
- Geo Location
- Social Media Links
- PDF (In Progress)
- App Store
- UPI Payment

---

### QR Customization

- Multiple module styles
  - Square
  - Rounded
  - Dots
  - Diamond
  - Bubble
  - Circle
  - Hexagon

- Eye style customization
- Foreground and background colors
- Gradient support
- Transparent background
- Logo overlay
- CTA frames
- Live preview

---

### Export Options

- PNG
- SVG
- PDF

---

### Additional Features

- Studio Templates
- Design History
- Favorites
- Duplicate Designs
- Keyboard Shortcuts
- Responsive Layout
- Dark Theme

---

# Tech Stack

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- Lucide React

## Backend

- FastAPI
- Python
- Segno
- Pillow
- SQLAlchemy

## Database

- PostgreSQL (Supported)

---

# Folder Structure

```text
QRCanvas
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   ├── services
│   │   ├── utils
│   │   ├── types
│   │   └── assets
│   │
│   └── public
│
├── backend
│   ├── app
│   ├── api
│   ├── models
│   ├── schemas
│   ├── services
│   └── utils
│
├── docs
│
├── assets
│
└── README.md
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/QRCanvas.git

cd QRCanvas
```

---

## Backend Setup

```bash
cd backend

python -m pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend will run at

```
http://localhost:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run at

```
http://localhost:5173
```

---

# Development Workflow

Start Backend

```bash
cd backend

uvicorn app.main:app --reload
```

Start Frontend

```bash
cd frontend

npm run dev
```

---

# Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + K | Command Palette |
| Ctrl + S | Save Design |
| Ctrl + E | Export QR |
| Ctrl + D | Duplicate Design |

---

# Supported QR Types

| QR Type | Status |
|----------|--------|
| URL | ✅ |
| Plain Text | ✅ |
| WiFi | ✅ |
| Email | ✅ |
| Phone | ✅ |
| SMS | ✅ |
| WhatsApp | ✅ |
| vCard | ✅ |
| Calendar | ✅ |
| Geo Location | ✅ |
| Social Media | ✅ |
| App Store | 🚧 |
| PDF | 🚧 |
| UPI Payment | 🚧 |

---

# Upcoming Features

- User Authentication
- Cloud Sync
- Dynamic QR Codes
- Scan Analytics
- Team Workspace
- QR Collections
- Shareable Projects
- Custom Templates
- API Access
- Mobile Optimization

---

# Screenshots

```
docs/screenshots/
```

Suggested screenshots:

- Landing Page
- QR Studio
- Templates
- Customization Panel
- Mobile View

---

# Deployment

## Frontend

Vercel

## Backend

Render

## Database

PostgreSQL

---

# Environment Variables

Backend

```env
DATABASE_URL=

SECRET_KEY=

ALGORITHM=

ACCESS_TOKEN_EXPIRE_MINUTES=
```

Frontend

```env
VITE_API_URL=http://localhost:8000
```

---

# Contributing

Contributions are welcome.

If you find a bug or have a feature suggestion, feel free to open an issue or submit a pull request.

---

# Project Status

Current Version

```
v1.0.0-beta
```

Status

```
Active Development
```

---

# License

This project is licensed under the MIT License.

---

# Author

**Adarsh Vishwakarma**

GitHub

https://github.com/VishwaAdarsh

---

## Notes

This project is being developed as a modern QR code design platform with a focus on usability, responsive design, and customization.