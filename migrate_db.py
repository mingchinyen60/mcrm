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

sql1 = "ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS project_code VARCHAR(50);"
sql2 = "ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS partner_account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL;"
sql3 = """CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_date VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    attendees VARCHAR(255),
    summary TEXT,
    action_items TEXT,
    follow_up_date VARCHAR(30),
    attachment_path VARCHAR(500),
    attachment_name VARCHAR(255),
    attachment_size INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);"""

full_sql = f"{sql1} {sql2} {sql3}"

cmd = f"""export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
echo '{PASS}' | sudo -S docker exec crm_postgres psql -U crm_user -d crm_db -c "{full_sql}"
"""

stdin, stdout, stderr = client.exec_command(cmd, get_pty=True)
for line in iter(stdout.readline, ""):
    print(line, end="")
    sys.stdout.flush()

client.close()
print("\n[DB Schema Migration Completed]")
