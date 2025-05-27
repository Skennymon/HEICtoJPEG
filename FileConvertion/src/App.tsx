import './App.css'
import Navbar from './components/Navbar'
import File from './components/File'
import { useState } from 'react'

function App() {

  const[files, setFiles] = useState<File[]>([])
  const[isLoading, setIsLoading] = useState<boolean>(false)
  const[convertedFiles, setConvertedFiles] = useState<Blob | null>(null);

  const onFileChange = (e) => {
    if (!e.target.files) return;

    const newFiles: File[] = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles])
  }

  const handleConvert = async () => {
    setIsLoading(true)
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file)
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-and-convert-to-PNG", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
        setIsLoading(false)
      }

      const blob = await response.blob()

      if (blob.type !== "application/zip") {
        throw new Error("Expected a zip, instead got: " + blob.type);
        setIsLoading(false)
      }

      setConvertedFiles(blob)
      setIsLoading(false)

    }
    catch(error) {
      console.log("Error during upload: ", error);
      setIsLoading(false)
    }

    setIsLoading(false)
    
  }

  return (
    <>
      <Navbar/>

      <div className="h-[20rem] border bg-gradient-to-bl from-gray-900 to-gray-400 flex items-center justify-center flex-col">
        <h2 className="text-white text-4xl">HEIC to JPEG Converter</h2>
        <p className="text-neutral-400 text-2xl">Convert photos from your iphone to a format your computer will not complain about :D.</p>
      </div>

      <div className="flex items-center justify-center mt-7">
        <input className="border rounded-md h-[2rem]" type="file" multiple onChange={onFileChange}/>
      </div>

      <div className="flex flex-col items-center justify-center mt-7">
        {files.map((file, index) => (
          <File fileName={file.name} key={index} file={file} setFiles={setFiles} files={files}/>
        ))}
        <div className="flex items-center justify-between mt-2 gap-2">
          <button className="border rounded-md p-2" onClick={handleConvert}>Convert</button>
          {isLoading && <span>Converting...</span>}
          {convertedFiles !== null &&
            <button className="bg-green-400 text-white">Download</button>
          }
        </div>
      </div>

      

    </>
  )
}

export default App
