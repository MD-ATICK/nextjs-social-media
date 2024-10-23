import more from '@/assets/more.png';
import { PostData } from "@/lib/types";
import Image from "next/image";
import { useState } from 'react';
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import DeletePostDialog from './DeletePostDialog';

interface Props {
    post: PostData,
    className?: string
}

export default function PostMoreButton({ post, className }: Props) {

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} size={'icon'} className={className}>
                        <Image src={more} className=' dark:invert' height={20} alt="" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeletePostDialog post={post} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
        </>
    )

}