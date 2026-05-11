import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(1).trim(),
    email: z.string().min(1).trim().email(),
    password: z.string().min(6),
    phone: z.string().min(8).trim(),
    birthday: z.string().trim().optional().nullable(),
    gender: z.boolean().optional().nullable(),
})

export const signInSchema = z.object({
    email: z.string().min(1).trim().email(),
    password: z.string().min(1),
})
