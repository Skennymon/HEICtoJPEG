# **Image File Converter**
Image file converter that lets you convert image files from one format to another! Supports various image formats like PNG, JPEG, WEBP, etc.

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

## This is the Deployed Repository. If you intend to host it yourself, please clone it from this repo instead https://github.com/Forged-Iron/HEICtoJPEG-LocalHost as their are some changes.

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
I stumbled across this neat library researching how I could convert image files. 
