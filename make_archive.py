import os
import zipfile

def make_zip(source_dir, output_zip):
    include_paths = [
        "docker-compose.yml",
        ".env",
        "OPERATIONS.md",
        "USER_MANUAL.md",
        "backend",
        "frontend"
    ]
    
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zipf:
        for item in include_paths:
            full_path = os.path.join(source_dir, item)
            if os.path.isfile(full_path):
                zipf.write(full_path, item)
                print(f"Added file: {item}")
            elif os.path.isdir(full_path):
                for root, dirs, files in os.walk(full_path):
                    if "node_modules" in dirs:
                        dirs.remove("node_modules")
                    if ".venv" in dirs:
                        dirs.remove(".venv")
                    if "__pycache__" in dirs:
                        dirs.remove("__pycache__")
                    if ".git" in dirs:
                        dirs.remove(".git")
                        
                    for file in files:
                        file_full = os.path.join(root, file)
                        rel_path = os.path.relpath(file_full, source_dir).replace("\\", "/")
                        zipf.write(file_full, rel_path)
                        print(f"Added: {rel_path}")

if __name__ == "__main__":
    make_zip(".", "precision-crm-update.zip")
    print("Archive precision-crm-update.zip successfully created!")
