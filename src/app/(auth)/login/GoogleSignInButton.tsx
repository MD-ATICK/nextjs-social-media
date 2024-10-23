import google from '@/assets/google.png';
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GoogleSignInButton() {
    return (
        <a href={'/login/google'} className="bg-white text-black flex justify-center items-center w-full hover:bg-gray-100 hover:text-black ">
            <Button
                variant={'outline'}
                className="flex font-semibold items-center gap-3 w-full "
            >
                <Image alt="" height={25} src={google} />
                Sign in with Google
            </Button>
        </a>
    )
}