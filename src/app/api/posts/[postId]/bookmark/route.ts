import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { BookmarkInfo } from "@/lib/types"

export async function GET(req: Request, { params: { postId } }: { params: { postId: string } }) {
    try {

        const { user: loggedUser } = await validateRequest()

        if (!loggedUser) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

      const bookmark = await prisma.bookmark.findUnique({
        where: {
            userId_postId : {
                userId : loggedUser.id,
                postId
            }
        }
      })
      

        if (!bookmark) {
            return Response.json({ error: 'Post not found' }, { status: 404 })
        }

        const data: BookmarkInfo = {
            isBookmarkByUser : !!bookmark
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

        await prisma.bookmark.upsert({
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
        })


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

        await prisma.bookmark.deleteMany({
            where: {
                userId: loggedUser.id,
                postId
            }
        })


        return new Response()
    } catch (error) {
        console.log(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}