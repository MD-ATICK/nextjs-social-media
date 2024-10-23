import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { LikeInfo } from "@/lib/types"

export async function GET(req: Request, { params: { postId } }: { params: { postId: string } }) {
    try {

        const { user: loggedUser } = await validateRequest()

        if (!loggedUser) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                likes: {
                    where: { userId: loggedUser.id },
                    select: { userId: true }
                },
                _count: {
                    select: {
                        likes: true
                    }
                }
            }
        })

        if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 404 })
        }

        const data: LikeInfo = {
            likes: post._count.likes,
            isLikedByUser: !!post.likes.length
        }

        return Response.json(data)


    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}



export async function POST(req: Request, { params: { postId } }: { params: { postId: string } }) {

    try {
        const { user: loggedUser } = await validateRequest()

        if (!loggedUser) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                authorId: true
            }
        })

        if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 401 })
        }

        await prisma.$transaction([
            prisma.like.upsert({
                where: {
                    userId_postId: {
                        userId: loggedUser.id,
                        postId
                    }
                },
                create: {
                    userId: loggedUser.id,
                    postId
                },
                update: {}
            }),
            ...(loggedUser.id !== post.authorId ?
                [
                    prisma.notification.create({
                        data: {
                            issuerId: loggedUser.id,
                            recipientId: post.authorId,
                            postId,
                            type: 'LIKE'
                        }
                    })
                ] : []
            )
        ])


        return new Response()
    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}



export async function DELETE(req: Request, { params: { postId } }: { params: { postId: string } }) {

    try {
        const { user: loggedUser } = await validateRequest()

        if (!loggedUser) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                authorId: true
            }
        })

        if (!post) {
            return Response.json({ error: 'Post not found' }, { status: 401 })
        }

        await prisma.$transaction([
            prisma.like.deleteMany({
                where: {
                    userId: loggedUser.id,
                    postId
                }
            }),
            prisma.notification.deleteMany({
                where : {
                    issuerId : loggedUser.id,
                    recipientId : post.authorId,
                    postId,
                    type : 'LIKE'
                }
            })
        ])

        return new Response()
    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}