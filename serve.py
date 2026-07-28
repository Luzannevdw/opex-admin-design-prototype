#!/usr/bin/env python3
"""Static server for the design prototype with caching disabled.

Browsers aggressively cache ES modules, which meant edits to app.js/components.js
weren't picked up without a hard refresh. This server sends no-store headers so
every reload fetches the latest files.
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    HTTPServer(("127.0.0.1", port), NoCacheHandler).serve_forever()
