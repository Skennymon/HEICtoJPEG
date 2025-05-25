from typing import Union, List
from fastapi import FastAPI, File, UploadFile
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
def convert_to_PNG(files: List[UploadFile] = File(...)):
    convertedFiles = []
    for file in files:
        if file.lower().endswith(".heic"):
            heif_file = pillow_heif.read_heif(files)
            image = Image.frombytes(
                heif_file.mode,
                heif_file.size,
                heif_file.data,
                "raw",
            )
            new_filename = file.splittext(file)[0] + ".png"
            convertedFiles.append(image.save(new_filename))


    
    return {files}

