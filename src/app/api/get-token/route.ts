import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export async function GET() {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // const currentTime = Math.floor(Date.now() / 1000);
        // const expirationTime = currentTime + 60 * 60; // 1 hour from now
        // const issuedAt = currentTime - 60; // issued 1 minute ago to avoid clock sync issues

        // Generate the token with optional 'iat' (issued at) and 'exp' (expiration) claims
        const token = streamServerClient.createToken(user.id);

        return Response.json({ token }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
