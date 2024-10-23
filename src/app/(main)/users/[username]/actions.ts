"use server"
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import { updateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validation";



export const updateUserProfile = async (values: UpdateUserProfileValues) => {
    try {

        const validatedValues = updateUserProfileSchema.parse(values)

        const { user } = await validateRequest()
        if (!user) throw Error('Unauthorized')


        const updatedUser = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: validatedValues,
                select: getUserDataSelect(user.id)
            })
            await streamServerClient.partialUpdateUser({
                id: user.id,
                set: {
                    name: validatedValues.displayName
                },
            })
            return updatedUser;
        })



        return { updatedUser };

    } catch (error) {
        console.log(error)
        return { error: 'something is wrong' };
    }
}

