import closeEye from '@/assets/hide.png';
import eye from '@/assets/view.png';
import { cn } from "@/lib/utils";
import Image from "next/image";
import * as React from "react";

const PasswordInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {

        const [showPassword, setShowPassword] = React.useState<boolean>(false);

        return (
            <div className=" relative h-11">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={cn(
                        "flex h-full w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />

                <Image onClick={() => setShowPassword(true)} src={eye} height={20} className={` ${showPassword && 'scale-0'} duration-75 cursor-pointer absolute top-1/2 -translate-y-1/2 right-4 opacity-80 hover:opacity-100`} alt="" />
                <Image onClick={() => setShowPassword(false)} src={closeEye} height={20} className={` ${!showPassword && 'scale-0'} duration-75 cursor-pointer absolute top-1/2 -translate-y-1/2 right-4 opacity-80 hover:opacity-100`} alt="" />
                
            </div>
        )
    }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput };

