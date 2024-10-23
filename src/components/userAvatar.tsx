
import avatarPlaceHolder from '@/assets/girl.jpg'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface props {
    avatarUrl: string | null | undefined,
    size?: number,
    className?: string
}
export default function UserAvatar({ avatarUrl, size, className }: props) {
    return (
        <Image
            src={avatarUrl || avatarPlaceHolder}
            alt='User Avatar'
            width={size ?? 40}
            height={size ?? 40}
            className={cn('aspect-square cursor-pointer h-fit flex-none rounded-full bg-secondary object-cover', className)}
        />
    )
}
