import socket
import requests
import threading
import time

def check_port(port):
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        if result == 0:
            # Check if it's an LLM endpoint
            try:
                resp = requests.get(f'http://localhost:{port}/api/tags', timeout=2)
                if resp.status_code == 200:
                    print(f"LLM found on port {port}: {resp.json()}")
            except:
                pass
    except:
        pass

threads = []
for port in range(1, 65536):
    t = threading.Thread(target=check_port, args=(port,))
    threads.append(t)
    t.start()
    if len(threads) >= 100:  # Limit concurrent threads
        for t in threads:
            t.join()
        threads = []

for t in threads:
    t.join()

print("Port scan complete.")