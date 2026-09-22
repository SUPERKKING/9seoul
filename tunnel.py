#!/usr/bin/env python3
import subprocess
import time
import re
import sys
import os

URL_FILE = "/Users/d_rectus/Documents/Nabi School/IDE Folder/tunnel_url.txt"

def run_tunnel():
    print("Starting localhost.run SSH tunnel daemon...")
    while True:
        try:
            proc = subprocess.Popen(
                [
                    "/usr/bin/ssh",
                    "-o", "StrictHostKeyChecking=no",
                    "-o", "ServerAliveInterval=15",
                    "-o", "ServerAliveCountMax=3",
                    "-o", "ExitOnForwardFailure=yes",
                    "-R", "80:localhost:8000",
                    "nokey@localhost.run"
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            
            for line in iter(proc.stdout.readline, ''):
                sys.stdout.write(line)
                sys.stdout.flush()
                # Match assigned https://*.lhr.life (ignore admin.localhost.run)
                match = re.search(r'https://[a-zA-Z0-9]+\.lhr\.life', line)
                if match:
                    url = match.group(0)
                    print(f"\n==========================================")
                    print(f">>> [ACTIVE IPHONE PUBLIC HTTPS URL]: {url} <<<")
                    print(f"==========================================\n")
                    try:
                        with open(URL_FILE, "w") as f:
                            f.write(url.strip())
                    except Exception as fe:
                        print("File write error:", fe)
            
            proc.wait()
            print("SSH tunnel closed, reconnecting in 3s...")
            time.sleep(3)
        except Exception as e:
            print(f"Tunnel error: {e}")
            time.sleep(3)

if __name__ == "__main__":
    run_tunnel()
