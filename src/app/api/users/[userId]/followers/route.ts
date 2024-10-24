import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";


export async function GET(req: Request, { params: { userId } }: { params: { userId: string } }) {

    try {
        const { user: loggedUser } = await validateRequest()

        if (!loggedUser) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                // make this just for check if atick is followed akib
                followers: {
                    where: {
                        followerId: loggedUser.id
                    },
                    select: {
                        followerId: true
                    }
                },
                _count: {
                    select: {
                        followers: true
                    }
                }
            }
        })


        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 })
        }



        const data: FollowerInfo = {
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.some(({ followerId }) => followerId === loggedUser.id)
        }


        return Response.json(data)
    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}


export async function POST(req: Request, { params: { userId } }: { params: { userId: string } }) {

    try {
        const { user: loggedUser } = await validateRequest()

        if (!loggedUser) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.$transaction([
            prisma.follow.upsert({
                where: {
                    followerId_followingId: {
                        followerId: loggedUser.id,
                        followingId: userId
                    }
                },
                create: {
                    followerId: loggedUser.id,
                    followingId: userId
                },
                update: {}
            }),
            prisma.notification.create({
                data: {
                    issuerId: loggedUser.id,
                    recipientId: userId,
                    type: 'FOLLOW'
                }
            })
        ])


        return new Response()
    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}


export async function DELETE(req: Request, { params: { userId } }: { params: { userId: string } }) {

    try {
        const { user: loggedUser } = await validateRequest()

        if (!loggedUser) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }


        await prisma.$transaction([
            prisma.follow.deleteMany({
                where: {
                    followerId: loggedUser.id,
                    followingId: userId
                }
            }),
            prisma.notification.deleteMany({
                where: {
                    issuerId: loggedUser.id,
                    recipientId: userId,
                    type: 'FOLLOW'
                }
            })
        ])

        return new Response()
    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}