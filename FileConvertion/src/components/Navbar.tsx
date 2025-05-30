export default function Navbar() {
    return (
        <div className="grid grid-cols-3 p-7">
            <img className="justify-self-start" src="/Logo.png" alt="Logo" width="200" height="200"/>
            <h1 className="justify-self-center text-4xl flex items-center items-justify">File Converter</h1>
            <a className="flex items-center items-justify justify-self-end hover:bg-neutral-400 rounded-full" href="https://github.com/Skennymon/HEICtoJPEG.git/">
               <img src="/github.svg" width="100" height="100"></img>                 
            </a>
        </div>
    )
}