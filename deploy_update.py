import paramiko
import sys
import time
import os
import getpass

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOST = os.getenv("NAS_HOST") or input("Enter Synology NAS Host [192.168.1.224]: ").strip() or "192.168.1.224"
PORT = int(os.getenv("NAS_PORT") or 22)
USER = os.getenv("NAS_USER") or input("Enter Synology NAS Username: ").strip()
PASS = os.getenv("NAS_PASSWORD") or getpass.getpass("Enter Synology NAS Password: ")

print(f"[Connecting] Synology NAS ({HOST}:{PORT})...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)
print("[Connected] Extracting update archive with 7z...")

extract_cmd = f"""
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
cd /volume1/docker/crm
echo '{PASS}' | sudo -S 7z x -y precision-crm-update.zip
"""
stdin, stdout, stderr = client.exec_command(extract_cmd, get_pty=True)
for line in iter(stdout.readline, ""):
    print(line, end="")
    sys.stdout.flush()

print("\n[Rebuilding Containers] Running docker-compose up -d --build...")
build_cmd = f"""
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
cd /volume1/docker/crm
echo '{PASS}' | sudo -S docker-compose up -d --build
"""
stdin, stdout, stderr = client.exec_command(build_cmd, get_pty=True)
for line in iter(stdout.readline, ""):
    print(line, end="")
    sys.stdout.flush()

print("\nWaiting 8s for services to stabilize...")
time.sleep(8)

print("\n--- [Active Containers Status] ---")
check_cmd = f"""
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
echo '{PASS}' | sudo -S docker ps --filter "name=crm" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
"""
stdin, stdout, stderr = client.exec_command(check_cmd, get_pty=True)
for line in iter(stdout.readline, ""):
    print(line, end="")
    sys.stdout.flush()

client.close()
print("\n[COMPLETE] Update deployment script finished.")
