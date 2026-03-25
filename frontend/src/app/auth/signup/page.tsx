
import Image from "next/image";

import Logo from "../../../../public/logo/Lucrum Logo.png"

import SignupForm from "@/components/signup/signup-form";

export default function Signup() {
    return (
      <main className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="w-80 h-100 p-5 rounded-3xl shadow-xl border flex flex-col items-center justify-center gap-y-5">
            <h1 className="w-full flex items-center justify-center">
                <Image src={Logo} alt="Logo" className="w-20"></Image>
                <span className="text-amber-400 text-5xl font-semibold text-shadow-sm">Lucrum</span>
            </h1>
            <SignupForm />
        </div>
      </main>
    );
  }
  