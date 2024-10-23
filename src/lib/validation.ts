import { z } from 'zod'

const requiredString =  z.string().trim().min(1 , 'Required')

// SIGN UP
export const signUpSchema = z.object({
    email : requiredString.email('Invalid Email address'),
    username : requiredString.regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, - and _ are allowed'),
    password : requiredString.min(8, 'Must be at least 8 characters')
})

export type SignUpValues = z.infer<typeof signUpSchema>


// LOGIN
export const loginSchema = z.object({
    username : requiredString,
    password : requiredString
})

export type LoginValues = z.infer<typeof loginSchema>


// POST
export const createPostSchema = z.object({
    content : requiredString,
    mediaIds : z.array(z.string()).max(5 , 'Cannot sent media more than 5.')
})

export type CreatePostValues = z.infer<typeof createPostSchema>



export const updateUserProfileSchema = z.object({
    displayName : requiredString,
    bio : z.string().max(1000 , "Must be bio under 1000 characters")
})

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>

export const createCommentSchema = z.object({
    content : requiredString
})