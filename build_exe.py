"""
PyInstaller Build Script for QR Studio Pro.
Compiles main.py into a standalone single-file Windows executable (.exe).
"""

import subprocess
import sys
import os

def build_executable():
    print("=" * 60)
    print("  🚀 Building QR Studio Pro Standalone Executable (.exe)")
    print("=" * 60)

    # PyInstaller flags for single file, windowed (no console window) executable
    cmd = [
        sys.executable,
        "-m",
        "PyInstaller",
        "--noconfirm",
        "--onedir",
        "--windowed",
        "--name=QR Studio Pro",
        "--add-data=ui_theme.py;.",
        "--add-data=qr_engine.py;.",
        "--add-data=history_manager.py;.",
        "main.py"
    ]

    print("Running build command:", " ".join(cmd))
    try:
        subprocess.check_call(cmd)
        print("\n" + "=" * 60)
        print(" SUCCESS! Executable built in directory: dist/QR Studio Pro/")
        print("=" * 60)
    except subprocess.CalledProcessError as e:
        print(f"\n[ERROR] Build failed with exit code: {e.returncode}")

if __name__ == "__main__":
    build_executable()
