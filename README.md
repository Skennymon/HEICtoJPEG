# **Image File Converter**
Image file converter that lets you convert image files from one format to another! Supports various image formats like PNG, JPEG, WEBP, etc.
## This is the Deployed Repository. If you intend to host it yourself, please clone it from this repo instead https://github.com/Forged-Iron/HEICtoJPEG-LocalHost as their are some changes.

## Features
- 📷 Convert Image files (including HEIC/HEIF) to any standard file format that 99% will want!
- 🤐 Get all of your converted images in a zipped up file.
- 🗃️ Convert multiple images at once at the same time.
- ❌ No hard file limit (assuming you're hosting this project yourself)

![image](https://github.com/user-attachments/assets/a2c7091b-2457-4165-815a-48b54176b434)

# **Motivation**
One of the main reasons why I've decided to make this app was for a few reasons. 
One of the reasons was because I was becoming increasingly frustrated with existing file converters on the internet and their limit on how many files you can convert within a 24 hour time period. 
I remember I had a bunch of photos imported from my iphone, and if you know, iphones usually take photos in HEIC format which doesn't play nice with Windows. I had 100s of photos I needed to convert to JPEG, but the existing online converters were hard capping me because I was converting too much.
So I essentially said screw it and decided to make one myself.

The second reason is because I thought this would be a good opporutunity to learn more backend stuff while also learning how to use AWS. As of now, I managed to get a EC2 Instance loaded up and I'm still trying to figure out how to use API Gateway so that it doesn't get spammed to death. Yes, I know the point of this project was for infinite
file convertions without a limit, but I don't want to be thousands of dollars in debt from AWS lmao. Although, it's very easy to fork this for yourself and host it on your own.


# How to Host Yourself
```bash
git clone https://github.com/Forged-Iron/HEICtoJPEG-LocalHost
```
```bash
cd FileConvertion
```
```bash
npm run dev
```
```bash
cd ../Backend
```
```bash
python -m venv .venv
```
```bash
.venv/Scripts/Activate.ps1
```
```bash
pip install -r requirements.txt
```
```bash
uvicorn main:app` or `fastapi dev main.py
```

# How I Built It
The tech stack is ReactJS with Vite Bundler and FastAPI as the backend. The python library doing the file converting is called pillow/pillow-heif (I'm not smart enough to figure out file convertion from scratch by myself lol). I'm planning on using AWS EC2 Instance in conjunction with API Gateway to host the backend and I haven't decided how I want to deploy the frontend just yet.

# Little Insight on how the Pillow Library Works
I stumbled across this neat library researching how I could convert image files. From what I understand, it's a fork from the original PIL (Python Imaging Library) and it essentially allows Python to read, write, and manipulate images in multiple formats. Whenever we manipulate or open an image, it decodes the raw binary pixels into a Python Image object. Pillow keeps the image pixel data in memory that allows it to resize / crop, rotate / flip, change colors, draw shapes / text, apply filters, etc. And Pillow allows us to save these Image objects into any format we want by encoding the image into its respective binary structure for a specific format (PNG, JPEG, GIF, etc.). We can also define how Pillow interprets each pixel's data ("RGB, "RGBA", "L", "CMYK").

# How I Programmed the Convertion
The file convertion is all under one function at the route /upload-and-convert-to/{convertTo}, and I was originally planning to split it into two functions (because convertion for HEIC Files is a little bit different from every other format). But I decided to just put it under one function because it wasn't so different to the point that it would matter. 

```python
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
```

The first couple lines of the function are pretty straight forward.

```python
if convertTo is None:
    convertTo = "PNG"
```
This lines makes it so that if the user doesn't specify a format they want to convert to, it just defaults to PNG (although this should be impossible if they use the website).
```python
zip_buffer = io.BytesIO()
```
This line opens up a buffer in memory that we can read, write, and seek from. This is essentially the zip file that we send back to the user.
```python
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
```
Now this is the meat and potatoes of the function. In short, it loops through every file that the user sends to be converted.
```python
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
```
It first checks if the current file is in .heic format and if it is, the program reads the binary file content and puts it into contents. Then we wrap the raw bytes in a file-like object where then Pillow decodes the HEIC file into a intermediate Python object (HeifImage) that contains, mode ("RGB", "RGBA"), size (width, height), and uncompressed raw pixel data. Then, Image.fromBytes(heif_file.mode, heif_file.size, heif_file.data, "raw",) creates a Pillow Image that interprets each pixel pixel in RGB, keeps the original files width and height, heif_file.data that contains the actual pixel data in memory, and "raw" which specifies the data is raw/uncompressed.
```python
    # Save image to memory
    img_bytes = io.BytesIO()
    image.save(img_bytes, format=convertTo)
    img_bytes.seek(0)
```
In essence, this just saves the image into memory in whatever format the user specified earlier. The interesting part is img_bytes.seek(0) which moves the internal pointer to the start of the buffer as whenever we write something, it's at the end of the buffer.
```python
    # Add to ZIP
    new_filename = file.filename.rsplit(".", 1)[0] + "." + convertTo
    zipf.writestr(new_filename, img_bytes.read())
```
This adds the converted file into a zip in which we send back to the user. the
```python
file.filename.rsplit(".", 1)[0] + "." + convertTo 
```
renames the file into the respective format it got converted to. And after that we're done converting a .heic image.

```python
contents = await file.read()
image = Image.open(io.BytesIO(contents))

if convertTo.lower() in ["jpeg", "jpg"] and image.mode in ("RGBA", "LA", "P"):
    image = image.convert("RGB")

img_bytes = io.BytesIO()
image.save(img_bytes, format=convertTo)
img_bytes.seek(0)

new_filename = file.filename.rsplit(".", 1)[0] + "." + convertTo
zipf.writestr(new_filename, img_bytes.read())
```

The process for other formats are essentially the same except we have another two checks.
```python
if convertTo.lower() in ["jpeg", "jpg"] and image.mode in ("RGBA", "LA", "P"):
    image = image.convert("RGB")
```
This checks that if the file we are trying to convert is a jpeg or jpg, and the images mode is in RGBA, LA, or P, it automatically converts it to RGB. The reason for this is because JPEG doesn't support transparency (alpha channels).

```python
zip_buffer.seek(0)

return StreamingResponse(zip_buffer, media_type="application/x-zip-compressed", headers={
    "Content-Disposition": "attachment; filename=converted_images.zip"
})
```
After we looped and converted every file, the backend sends back a compressed zip file back to the frontend with the name "converted_images.zip"
