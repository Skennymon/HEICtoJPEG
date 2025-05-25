from typing import Union, List
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from PIL import Image
from pillow_heif import register_heif_opener
import io
import zipfile
import pillow_heif
import os

app = FastAPI()
register_heif_opener()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload-and-convert-to-PNG")
async def convert_to_png(files: List[UploadFile] = File(...)):
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for file in files:
            if file.filename.lower().endswith(".heic"):
                # Read file content
                contents = await file.read()

                # Decode HEIC
                heif_file = pillow_heif.read_heif(io.BytesIO(contents))
                image = Image.frombytes(
                    heif_file.mode,
                    heif_file.size,
                    heif_file.data,
                    "raw",
                )

                # Save PNG to memory
                img_bytes = io.BytesIO()
                image.save(img_bytes, format="PNG")
                img_bytes.seek(0)

                # Add to ZIP
                new_filename = file.filename.rsplit(".", 1)[0] + ".png"
                zipf.writestr(new_filename, img_bytes.read())

    zip_buffer.seek(0)

    return StreamingResponse(zip_buffer, media_type="application/x-zip-compressed", headers={
        "Content-Disposition": "attachment; filename=converted_images.zip"
    })

