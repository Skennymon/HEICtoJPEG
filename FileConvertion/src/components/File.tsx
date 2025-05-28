import { Dispatch, SetStateAction } from 'react'

interface FileProps {
    fileName: string;
    file: File;
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
}

export default function File({ fileName, files, setFiles, file } : FileProps) {

    const deleteFile = () => {
        const newFiles = files.filter((currentFile) => currentFile !== file)
        setFiles(newFiles)
    }

    return (
        <div className="flex justify-between items-center w-full border p-2 rounded-md">
            <p>{fileName}</p>
            <button onClick={deleteFile}>X</button>
        </div>
    )
}