import { google, lucia } from "@/auth";
import kyInstance from "@/lib/ky";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { slugify } from "@/lib/utils";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const code = req.nextUrl.searchParams.get('code')
    const state = req.nextUrl.searchParams.get("state")

    const storedState = cookies().get("state")?.value
    const storedCodeVerifier = cookies().get("codeVerifier")?.value

    if (state !== storedState || !code || !storedCodeVerifier || !state || !storedState) {
        return new Response("Invalid request", { status: 400 })
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier)

        const googleUser = await kyInstance.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        }).json<{ id: string, name: string, email: string, picture: string }>()

        console.log('googleUser', googleUser)

        const existingUser = await prisma.user.findUnique({
            where: {
                googleId: googleUser.id
            }
        })

        if (existingUser) {
            const session = await lucia.createSession(existingUser.id, {})
            const sessionCookie = lucia.createSessionCookie(session?.id)

            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            )

            return new Response("Logged in successfully", { status: 302, headers: { Location: "/" } })
        }

        const userId = generateIdFromEntropySize(10)
        const username = slugify(googleUser.name)


        await prisma.$transaction(async (tx) => {
            await tx.user.create({
                data: {
                    id: userId,
                    username,
                    displayName: username,
                    avatarUrl: googleUser.picture,
                    email: googleUser.email,
                    googleId: googleUser.id
                }
            })
            await streamServerClient.upsertUser({
                id: userId,
                username,
                name: username
            })
        })


        const session = await lucia.createSession(userId, {})
        const sessionCookie = lucia.createSessionCookie(session?.id)

        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )

        return new Response("Google signUp in successfully", { status: 302, headers: { Location: "/" } })


    } catch (error) {
        console.log(error)
        if (error instanceof OAuth2RequestError) {
            return new Response("Failed to authenticate with Google", { status: 400 })
        }
        return new Response("Internal Server Error", { status: 500 })
    }

}
