

export default function LoginForm(){
    return(
        <form className="w-full flex flex-col items-center gap-y-3">
            <fieldset className="w-2/3 flex flex-col justify-center gap-y-3">
                <input type="email" className="px-2 py-1 text-black border outline-none rounded-md" placeholder="Email"/>
                <input type="password" className="px-2 py-1 text-black border outline-none rounded-md" placeholder="Password"/>
            </fieldset>
            <fieldset className="w-full flex flex-col items-center gap-y-2">
                <button type="submit" className="w-1/3 h-8 bg-amber-400 border-amber-400 border-2 text-white font-semibold rounded-md cursor-pointer transition-all duration-200 hover:bg-white hover:text-amber-400">Login</button>
                <h2 className="text-sm text-black">Don't have an account? <a href="/auth/signup" className="text-amber-400 cursor-pointer">Signup</a></h2>
            </fieldset>
        </form>
    )
}