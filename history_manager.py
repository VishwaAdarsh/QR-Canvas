"""
History Manager for QR Canvas.
Handles saving, loading, and recording generated QR code history.
"""

import json
import os
from datetime import datetime

HISTORY_FILE = "history.json"
MAX_HISTORY_ITEMS = 50

class HistoryManager:
    def __init__(self, filepath=HISTORY_FILE):
        self.filepath = filepath
        self.history = self._load_history()

    def _load_history(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return []
        return []

    def add_entry(self, data_summary, content_type="URL", gen_time=0.0):
        entry = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "type": content_type,
            "data": data_summary,
            "gen_time_sec": round(gen_time, 4)
        }
        
        # Avoid duplicate consecutive entries
        if self.history and self.history[0].get("data") == data_summary:
            return

        self.history.insert(0, entry)
        if len(self.history) > MAX_HISTORY_ITEMS:
            self.history = self.history[:MAX_HISTORY_ITEMS]

        self._save_to_disk()

    def save_entry(self, content_type, data_summary, fg_color="#000000", bg_color="#FFFFFF", format_saved="PNG", output_filename=None):
        self.add_entry(data_summary, content_type)

    def _save_to_disk(self):
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(self.history, f, indent=2)
        except Exception as e:
            print(f"Error saving history: {e}")

    def get_entries(self):
        return self.history

    def clear_history(self):
        self.history = []
        self._save_to_disk()
