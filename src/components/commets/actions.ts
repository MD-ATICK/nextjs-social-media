"use server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getCommentDataInclude, PostData } from "@/lib/types"
import { createCommentSchema } from "@/lib/validation"

export async function submitComment({ post, content }: { post: PostData, content: string }) {
    const { user } = await validateRequest()
    if (!user) throw Error('Unauthorized')

    const { content: contentValidated } = createCommentSchema.parse({ content })

  const [newComment] =  await prisma.$transaction([
         prisma.comment.create({
            data: {
                content: contentValidated,
                postId: post.id,
                userId: user.id
            },
            include: getCommentDataInclude(user.id)
        }),
        ...(post.author.id !== user.id ?
            [
                prisma.notification.create({
                    data: {
                        issuerId: user.id,
                        recipientId: post.author.id,
                        postId: post.id,
                        type: 'COMMENT'
                    }
                })
            ]
            : []
        )
    ])

    return newComment;
}


export async function deleteComment(id: string) {
    const { user } = await validateRequest()
    if (!user) throw Error('Unauthorized')

    const comment = await prisma.comment.findUnique({
        where: { id }
    })

    if (!comment) throw Error('comment not found')

    if (comment.userId !== user.id) throw Error('Unauthorized')

    const deletedComment = await prisma.comment.delete({ where: { id }, include: { post: true } })
    return deletedComment;

}