from fastapi import APIRouter, UploadFile, File

router = APIRouter(
    prefix="/api",
    tags=["upload"]
)


@router.post("/upload")
async def upload_medical_report(
    file: UploadFile = File(...)
):
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "File uploaded successfully"
    }