from fastapi import APIRouter, UploadFile, File

from app.utils.file_handler import save_uploaded_file
from app.ocr.pdf_extractor import extract_text_from_pdf

router = APIRouter(
    prefix="/api",
    tags=["upload"]
)


@router.post("/upload")
async def upload_medical_report(
    file: UploadFile = File(...)
):
    contents = await file.read()

    filepath = save_uploaded_file(file, contents)

    extracted_text = extract_text_from_pdf(filepath)

    return {
        "filename": file.filename,
        "saved_path": filepath,
        "extracted_text": extracted_text[:3000]
    }