import paramiko
import time
import sys
import os
import getpass

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOST = os.getenv("NAS_HOST") or input("Enter Synology NAS Host [192.168.1.224]: ").strip() or "192.168.1.224"
PORT = int(os.getenv("NAS_PORT") or 22)
USER = os.getenv("NAS_USER") or input("Enter Synology NAS Username: ").strip()
PASS = os.getenv("NAS_PASSWORD") or getpass.getpass("Enter Synology NAS Password: ")

def run():
    print(f"[Step 1] Connecting to Synology NAS {HOST}:{PORT} as {USER}...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=15)
        print("[SUCCESS] SSH connected successfully!")
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        sys.exit(1)

    commands = [
        ("System & User Verification", "whoami; id"),
        ("Docker Version Check", "docker --version; docker compose version"),
        ("Verify CRM Directory", "ls -la /volume1/docker/crm")
    ]

    for label, cmd in commands:
        print(f"\n--- [Running: {label}] ---")
        print(f"Command: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        if out:
            print(f"Output:\n{out.strip()}")
        if err:
            print(f"Error:\n{err.strip()}")

    # Now run docker compose build and up with sudo
    deploy_cmd = f"cd /volume1/docker/crm && echo '{PASS}' | sudo -S docker compose up -d --build"
    print(f"\n--- [Step 2] Building & Starting CRM Containers ---")
    print(f"Command: cd /volume1/docker/crm && sudo docker compose up -d --build")
    
    stdin, stdout, stderr = client.exec_command(deploy_cmd, get_pty=True)
    # Stream output in real time
    for line in iter(stdout.readline, ""):
        print(line, end="")
        sys.stdout.flush()
        
    print("\n--- [Step 3] Verifying Running Containers ---")
    stdin, stdout, stderr = client.exec_command(f"echo '{PASS}' | sudo -S docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'", get_pty=True)
    for line in iter(stdout.readline, ""):
        print(line, end="")
        sys.stdout.flush()

    client.close()
    print("\n[COMPLETE] Deployment procedure finished.")

if __name__ == "__main__":
    run()
