import girl from '@/assets/girl.jpg'
import { Metadata } from "next"
import Image from "next/image"
import Link from 'next/link'
import GoogleSignInButton from './GoogleSignInButton'
import LoginForm from './loginForm'

export const metadata: Metadata = {
    title: 'Login'
}

export default function SignUpPage() {
    return (
        <main className=" flex h-full md:h-screen items-center justify-center md:p-5 font-medium text-sm">
            <div className=" shadow-2xl flex flex-col-reverse md:flex-row h-full md:max-h-[90%] w-full max-w-[64rem] md:rounded-2xl overflow-hidden md:bg-card">
                <div className=' w-full md:w-1/2 h-full p-[6vw] md:p-[3vw] flex flex-col gap-4'>
                    <div className=' space-y-2'>
                        <h1 className=' font-bold text-2xl md:text-3xl'>Login to {process.env.NEXT_WEB_NAME}</h1>
                        <p className=' text-sm md:text-[15px] text-gray-400'>A Place or Platform where even you can find a friend.</p>
                    </div>
                    <GoogleSignInButton />
                    <div className=' flex items-center gap-3'>
                        <div className=' bg-muted flex-1  h-px' />
                        <span className=' font-medium text-sm'>OR</span>
                        <div className=' bg-muted flex-1  h-px' />
                    </div>
                    <LoginForm />
                    <Link href={'/signup'} className=' text-sm text-center w-full text-gray-300 hover:text-white'>haven&apos;t any account? Sign up</Link>
                </div>
                <div className=" w-full aspect-[10/9] md:w-1/2 md:h-full relative">
                    <Image sizes="300px" fill src={girl} placeholder="blur" className=' object-cover' alt="" />
                </div>
            </div>
        </main>
    )
}
