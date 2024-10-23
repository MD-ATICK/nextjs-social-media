import prisma from "@/lib/prisma"
import { UTApi } from "uploadthing/server"

export async function GET(req: Request) {
    try {


        const authHeader = req.headers.get('Authorization')


        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return Response.json(
                { message: 'Invalid Authorization Header' },
                { status: 401 }
            )
        }

        // const unusedMedia = await prisma.media.findMany({
        //     where: {
        //         post: null,
        //         ...(process.env.NODE_ENV === 'production' ? {
        //             createdAt: {
        //                 lte: new Date(Date.now() - 1000 * 60 * 60 * 24)
        //             }
        //         } : {})
        //     },
        //     select: {
        //         id: true,
        //         url: true,
        //         post: true
        //     }
        // })


        const unusedMedia = await prisma.media.findMany({
            where: {
                post: null,
                createdAt: {
                    lte: new Date(Date.now() - 1000 * 60 * 60 * 24)
                }
            },
            select: {
                id: true,
                url: true,
                post: true,
            }
        })


        new UTApi().deleteFiles(
            unusedMedia.map(m => m.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1])
        )

        await prisma.media.deleteMany({
            where: {
                id: {
                    in: unusedMedia.map(m => m.id)
                }
            }
        })

        return new Response()

    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}