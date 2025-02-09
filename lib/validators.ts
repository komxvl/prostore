import {z} from 'zod'
import { formatNumberWithDecimal } from './utils'

const currency = z.string().refine((value => /^\d+(\.\d{2})?/.test(formatNumberWithDecimal(Number(value)))), "two decimal places")

export const insertProducts = z.object({
    name: z.string().min(3, "At least 3 charactesr"),
    slug: z.string().min(3, "At least 3 charactesr"),
    category: z.string().min(3, "At least 3 charactesr"),
    brand: z.string().min(3, "At least 3 charactesr"),
    description: z.string().min(3, "At least 3 charactesr"),
    stock: z.coerce.number(),
    images: z.array(z.string().min(1, 'Must have 1 img')),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
})

export const signInFormSchema = z.object({
    email: z.string().email('Invalod email'),
    password: z.string().min(6, "At last 6 symbols")
}) 


export const signUpFormSchema = z.object({
    name: z.string().min(3, "At least 3 charactesr"),
    email: z.string().email('Invalod email'),
    password: z.string().min(6, "At last 6 symbols"),
    confirmPassword: z.string().min(6, "At last 6 symbols").refine((data: any) => data.password === data.confirmPassword, {
        message: "Not equal",
        path: ['confirmPassword']
    })
}) 