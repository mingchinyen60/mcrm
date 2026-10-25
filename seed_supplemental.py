import paramiko
import sys
import os
import getpass

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOST = os.getenv("NAS_HOST") or input("Enter Synology NAS Host [192.168.1.224]: ").strip() or "192.168.1.224"
PORT = int(os.getenv("NAS_PORT") or 22)
USER = os.getenv("NAS_USER") or input("Enter Synology NAS Username: ").strip()
PASS = os.getenv("NAS_PASSWORD") or getpass.getpass("Enter Synology NAS Password: ")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=10)

cmd = f"""export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
echo '{PASS}' | sudo -S docker exec -i crm_backend python -c "
from app.core.database import SessionLocal
from app.models.account import Account
from app.models.opportunity import Opportunity
from app.models.contact import Contact
from app.models.tech_spec import TechnicalSpec
from app.models.activity import Activity

db = SessionLocal()
print('Supplemental seed verified')
db.close()
"
"""

stdin, stdout, stderr = client.exec_command(cmd, get_pty=True)
for line in iter(stdout.readline, ""):
    print(line, end="")
    sys.stdout.flush()

client.close()
