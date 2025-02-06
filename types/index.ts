import {z} from 'zod'
import { insertProducts } from '@/lib/validators'
export type Product = z.infer<typeof insertProducts> & {
    is: string,
    name: string,
    
}