import './App.css'
import Navbar from './components/Navbar'
import File from './components/File'
import { useState } from 'react'

function App() {

  const[files, setFiles] = useState<File[]>([])

  const onFileChange = (e) => {
    if (!e.target.files) return;

    const newFiles: File[] = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles])
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
          <button className="border rounded-md p-2">Convert</button>
        </div>
      </div>

      

    </>
  )
}

export default App
