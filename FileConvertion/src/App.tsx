import './App.css'
import Navbar from './components/Navbar'
import File from './components/File'
import { useState } from 'react'

function App() {

  const[files, setFiles] = useState<File[]>([])
  const[isLoading, setIsLoading] = useState<boolean>(false)
  const[convertedFiles, setConvertedFiles] = useState<Blob | null | MediaSource>(null)
  const[convertTo, setConvertTo] = useState<string>("PNG")
  const[error, setError] = useState<string | null>(null)


  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles: File[] = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles])
  }

  const handleConvert = async () => {
    
    if(files.length > 20) {
      setError("You can only upload up to 20 files at a time.")
      return
    }
    setError(null)
    setConvertedFiles(null)
    setIsLoading(true)
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file, file.name)
    });

    console.log(...formData)

    if(formData.entries().next().done) {
      setError("You gotta put some files in to convert them.")
      return
    }

    try {
      const response = await fetch(`https://heictojpeg.onrender.com/upload-and-convert-to/${convertTo}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        setIsLoading(false)
        setError("Either you tried to convert an unsupported file, or the server is cooked.")
        throw new Error("Something went wrong");
      }

      const blob = await response.blob()
      setConvertedFiles(blob)
      setIsLoading(false)

      if(blob.size === 0) {
        setError("Error cus you probably tried to convert an unsupported file!")
      }

    }
    catch(error) {
      console.log("Error during upload: ", error);
      setIsLoading(false)
    }

  }

  function handleDownload() {
    if (convertedFiles) {
      const url = URL.createObjectURL(convertedFiles);
      const link = document.createElement("a");
      link.href = url;
      link.download = "converted_images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  return (
    <>
      <Navbar/>

      <div className="h-[20rem] border bg-gradient-to-bl from-gray-900 to-gray-400 flex items-center justify-center flex-col">
        <h2 className="text-white md:text-4xl text-3xl">Image File Converter</h2>
        <p className="text-neutral-400 text-2xl">Convert photos/images from your iphone to a format your computer will not complain about :D.</p>
      </div>

      <div className="flex flex-col items-center justify-center mt-7 p-7">
        <h2 className="text-red-500 text-2xl">If you're using the deployed version of this website, their is a very high chance the convertion will take a while because I&apos;m using the free tier for Render (I&apos;m broke I&apos;m sorry). They&apos;re cringe as they turn off my FastAPI instance every 15 minutes of inactivity and you have to wait for it to restart. Even then, it&apos;s still pretty slow because I suspect it&apos;s because the free tier only gives the instance 512MB and only of memory "0.1 CPU" 🗿. If you want max speed, please host this site yourself (it&apos;s ALOT faster I promise) and I&apos;ve even gave the courtesy of giving instructions on how to host it locally on your own on the github repo hehe.</h2>
        <h2>Select file(s):</h2>
        <input className="border rounded-md h-[2rem]" type="file" multiple onChange={onFileChange}/>
      </div>

      <section className="flex flex-col items-center justify-center p-2">
        <div className="flex flex-col items-center mt-7 border w-[50%] min-h-[20rem] p-2 rounded-3xl gap-2">
          {files.map((file, index) => (
            <File fileName={file.name} key={index} file={file} setFiles={setFiles} files={files} isConverting={isLoading}/>
          ))}
          <div className="flex items-center justify-between mt-2 gap-2">
          </div>
        </div>

        <div className="flex gap-2">
          <select onChange={(e) => setConvertTo(e.target.value)}>
            <option value="PNG">PNG</option>
            <option value="JPEG">JPEG</option>
            <option value="BMP">BMP</option>
            <option value="GIF">GIF</option>
            <option value="TIFF">TIFF</option>
            <option value="WEBP">WEBP</option>
            <option value="HEIF">HEIF</option>
            <option value="ICO">ICO</option>
            <option value="PPM">PPM</option>
            <option value="PDF">PDF</option>
            <option value="EPS">EPS</option>
            <option value="TGA">TGA</option>
          </select>
          {files && <button className="mt-2 border rounded-md p-2" onClick={handleConvert}>Convert</button>}
          {convertedFiles !== null &&
            <button className="bg-green-400 text-white rounded-md" onClick={handleDownload}>Download</button>
          }
        </div>
        {error !== null && <p className="text-red-500">{error}</p>}
      </section>

      <section className="flex flex-col items-center justify-center mt-2 p-2 gap-7">
          <h2 className="font-bold text-4xl">How it works</h2>
          <img src="/HowItWorks.png" className="md:w-[50%] w-[75%]" />
          
          <p>If you actually want to know how it works and how I built it, <span><a className="underline text-blue-400 hover:text-blue-200" href="https://github.com/Skennymon/HEICtoJPEG.git/" target="_blank">the writeup can be found here.</a></span></p>
          
      </section>

      

    </>
  )
}

export default App
