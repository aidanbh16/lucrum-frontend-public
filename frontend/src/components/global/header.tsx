
import Image from "next/image"

import Logo from "../../../public/logo/Lucrum Logo.png"

export default function Header(){
    return(
        <header className="w-full h-10 px-5 bg-white flex justify-center fixed shadow-lg">
            <div className="flex items-center gap-x-2 select-none">
                <Image src={Logo} alt="Logo" className="h-9/10 w-15"/>
                <h1 className="text-amber-400 text-3xl font-semibold text-shadow-sm">Lucrum</h1>
            </div>
            <p>123</p>
        </header>
    )
}