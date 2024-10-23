import loadingImage from '@/assets/loading.png';
import sendMessage from '@/assets/send-message.png';
import { PostData } from "@/lib/types";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useSubmitCommentMutation } from "./mutations";

interface props {
    post: PostData
}
export default function CommentInput({ post }: props) {

    const [input, setInput] = useState("");

    const mutation = useSubmitCommentMutation(post.id)

    async function onsubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!input) return;

        mutation.mutate(
            {
                post,
                content: input
            },
            {
                onSuccess: () => setInput('')
            }
        )
    }

    return (
        <form onSubmit={onsubmit} className=" flex w-full items-center gap-2">
            <Input
                placeholder="write a comment"
                value={input}
                className=' border-2'
                onChange={(e) => setInput(e.target.value)}
                disabled={mutation.isPending}
                autoFocus
            />
            <Button type="submit" variant={'ghost'} size={'icon'} disabled={!input.trim() || mutation.isPending}>
                {!mutation.isPending ?
                    <Image src={sendMessage} height={20} alt="send" className=' dark:invert' />
                    :
                    <Image src={loadingImage} className=" animate-spin dark:invert" height={20} alt="send"  />
                }
            </Button>
        </form>

    )
}
