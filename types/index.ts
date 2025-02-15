import {z} from 'zod'
import { cartItemSchema, insertCartSchema, insertProducts } from '@/lib/validators'
export type Product = z.infer<typeof insertProducts> & {
    is: string,
    name: string,
    
}

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;