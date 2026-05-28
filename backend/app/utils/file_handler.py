import os
from uuid import uuid4


UPLOAD_DIR = "uploads"


def save_uploaded_file(file, contents):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    filename = f"{uuid4()}-{file.filename}"

    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(contents)

    return filepath