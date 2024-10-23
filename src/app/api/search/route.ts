import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"
import { getPostDataInclude, PostsPage } from "@/lib/types"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    try {

        const q = request.nextUrl.searchParams.get('q') || ""
        const cursor = request.nextUrl.searchParams.get('cursor') || undefined

        const searchQuery = q.split(" ").join(" & ")
        const pageSize = 10

        const { user } = await validateRequest()
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { content: { contains: searchQuery, mode: 'insensitive' } },
                    { author: { username: { contains: searchQuery, mode: 'insensitive' } } },
                    { author: { displayName: { contains: searchQuery, mode: 'insensitive' } } },
                ]
            },
            include: getPostDataInclude(user.id), // Assuming this function returns the necessary includes for your Post model
            orderBy: { createdAt: 'desc' },
            take: pageSize + 1, // +1 for determining if there's a next page
            cursor: cursor ? { id: cursor } : undefined,
        })

        const nextCursor = posts.length > pageSize ? posts[pageSize].id : null

        const data: PostsPage = {
            posts: posts.slice(0, pageSize),
            nextCursor
        }


        return Response.json(data)


    } catch (error) {
        console.error(error)
        return Response.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
