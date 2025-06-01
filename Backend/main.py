from typing import Union, List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from PIL import Image
from pillow_heif import register_heif_opener
import io
import zipfile
import pillow_heif
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()
register_heif_opener()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload-and-convert-to/{convertTo}")
async def convert_to_png(files: List[UploadFile] = File(...), convertTo: str | None = None):
    
    if convertTo is None:
        convertTo = "PNG"

    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for file in files:
            try:
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

                    # Save image to memory
                    img_bytes = io.BytesIO()
                    image.save(img_bytes, format=convertTo)
                    img_bytes.seek(0)
                    
                    # Add to ZIP
                    new_filename = file.filename.rsplit(".", 1)[0] + "." + convertTo
                    zipf.writestr(new_filename, img_bytes.read())
                else:
                    contents = await file.read()
                    image = Image.open(io.BytesIO(contents))
                    
                    if convertTo.lower() in ["jpeg", "jpg"] and image.mode in ("RGBA", "LA", "P"):
                        image = image.convert("RGB")
                    
                    img_bytes = io.BytesIO()
                    image.save(img_bytes, format=convertTo)
                    img_bytes.seek(0)

                    new_filename = file.filename.rsplit(".", 1)[0] + "." + convertTo
                    zipf.writestr(new_filename, img_bytes.read())
            except:
                raise HTTPException(status_code=400, detail="Unsupported File")


    zip_buffer.seek(0)

    return StreamingResponse(zip_buffer, media_type="application/x-zip-compressed", headers={
        "Content-Disposition": "attachment; filename=converted_images.zip"
    })

