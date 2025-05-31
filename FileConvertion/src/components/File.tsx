import { Dispatch, SetStateAction } from 'react'

interface FileProps {
    fileName: string;
    file: File;
    files: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
    isConverting: boolean;
}

export default function File({ fileName, files, setFiles, file, isConverting } : FileProps) {

    const deleteFile = () => {
        const newFiles = files.filter((currentFile) => currentFile !== file)
        setFiles(newFiles)
    }

    return (
        <div className="flex justify-between items-center w-full border p-2 rounded-md">
            <p>{fileName}</p>
            <div className="flex gap-2">
                {isConverting && <span>Converting...</span>}
                <button onClick={deleteFile}>X</button>
            </div>
        </div>
    )
}