export default function Navbar() {
    return (
        <div className="grid grid-cols-3 p-7">
            <img className="justify-self-start h-15 w-25 md:h-20 md:w-35" src="/Logo.png" alt="Logo"/>
            <h1 className="justify-self-center text-[17px] flex items-center items-justify md:text-4xl">File Converter</h1>
            <a className="flex items-center items-justify justify-self-end hover:bg-neutral-400 rounded-full" href="https://github.com/Skennymon/HEICtoJPEG.git/">
               <img src="/github.svg" className="h-15 w-15 md:h-20 md:w-20"></img>                 
            </a>
        </div>
    )
}