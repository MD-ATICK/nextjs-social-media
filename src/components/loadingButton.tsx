import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";


interface LoadingButtonProps extends ButtonProps {
    isPending: boolean
}

export default function LoadingButton({ isPending, disabled, className, ...props }: LoadingButtonProps) {
    return (
        <Button
            className={cn('', className)}
            disabled={disabled || isPending}
            {...props}
        >
            {isPending ? <ClipLoader color="white" size={20} /> : props.children}
        </Button>
    )
}
