import more from '@/assets/more.png';
import { CommentData } from "@/lib/types";
import Image from "next/image";
import { useState } from 'react';
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import DeleteCommentDialog from './DeleteCommentDialog';

interface Props {
    comment: CommentData,
    className?: string
}

export default function CommentMoreButton({ comment, className }: Props) {

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
            <DeleteCommentDialog comment={comment} open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
        </>
    )

}