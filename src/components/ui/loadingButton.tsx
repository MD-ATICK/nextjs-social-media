import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";
import { Button, ButtonProps } from "./button";


// interface LoadingButtonProps extends ButtonProps {
//     isPending: boolean
// }

export default function LoadingButton({ disabled, className, ...props }: ButtonProps) {
    return (
        <Button
            className={cn('', className)}
            disabled={disabled}
            {...props}
        >
            {disabled ? <ClipLoader color="white" size={20} /> : props.children}
        </Button>
    )
}
