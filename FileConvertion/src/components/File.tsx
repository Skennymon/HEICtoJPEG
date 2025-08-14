import type { Dispatch, SetStateAction } from 'react';

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

    const imageURL = URL.createObjectURL(file)

    return (
        <div className="flex justify-between items-center w-full border p-2 rounded-md">
            
            <div className="flex items-center justify-center gap-2">
                <img src={imageURL} alt="Image Preview" height={100} width={100}/>
                <p>{fileName}</p>
            </div>
            <div className="flex gap-2">
                {isConverting && <span>Converting...</span>}
                <button onClick={deleteFile}>X</button>
            </div>
        </div>
    )
}