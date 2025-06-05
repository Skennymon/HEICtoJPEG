# **Image File Converter**
Image file converter that lets you convert image files from one format to another! Supports various image formats like PNG, JPEG, WEBP, etc.

![image](https://github.com/user-attachments/assets/a2c7091b-2457-4165-815a-48b54176b434)

# **Motivation**
One of the main reasons why I've decided to make this app was for a few reasons. 
One of the reasons was because I was becoming increasingly frustrated with existing file converters on the internet and their limit on how many files you can convert within a 24 hour time period. 
I remember I had a bunch of photos imported from my iphone, and if you know, iphones usually take photos in HEIC format which doesn't play nice with Windows. I had 100s of photos I needed to convert to JPEG, but the existing online converters were hard capping me because I was converting too much.
So I essentially said screw it and decided to make one myself.

The second reason is because I thought this would be a good opporutunity to learn more backend stuff while also learning how to use AWS. As of now, I managed to get a EC2 Instance loaded up and I'm still trying to figure out how to use API Gateway so that it doesn't get spammed to death. Yes, I know the point of this project was for infinite
file convertions without a limit, but I don't want to be thousands of dollars in debt from AWS lmao. Although, it's very easy to fork this for yourself and host it on your own.

# How to Host Yourself
`git clone https://github.com/Skennymon/HEICtoJPEG.git`\
`cd FileConvertion`\
`npm run dev`\
`cd ../Backend`\
`python -m venv .venv`\
`.venv/Scripts/Activate.ps1`\
`pip install -r requirements.txt`\
`uvicorn main:app` or `fastapi dev main.py`

# How I Built It
TBC...
