import {z} from 'zod'
import { formatNumberWithDecimal } from './utils'
import { PAYMENT_METHODS } from './constants'

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
    password: z.string().min(6, "Pwd At last 6 symbols")
}) 


export const signUpFormSchema = z.object({
    name: z.string().min(3, "Name At least 3 charactesr"),
    email: z.string().email('Invalod email'),
    password: z.string().min(6, "PWD At last 6 symbols"),
    confirmPassword: z.string().min(6, "Confirm pwd At last 6 symbols").refine((data: any) => data.password === data.confirmPassword, {
        message: "Not equal",
        path: ['confirmPassword']
    })
}) 

export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    image: z.string().min(1, 'Image is required'),
    price: currency,
  });
  
  export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.string().optional().nullable(),
  });

  
  // Schema for payment method
export const paymentMethodSchema = z
.object({
  type: z.string().min(1, 'Payment method is required'),
})
.refine((data) => PAYMENT_METHODS.includes(data.type), {
  path: ['type'],
  message: 'Invalid payment method',
});

export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
    lat: z.number().optional(),
    lng: z.number().optional(),
  });
  

  export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'User is required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
      message: 'Invalid payment method',
    }),
    shippingAddress: shippingAddressSchema,
  });
  
 
  export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    qty: z.number(),
  });
  
 
  export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string(),
  });
  

  export const updateProfileSchema = z.object({
    name: z.string().min(3, 'Name must be at leaast 3 characters'),
    email: z.string().min(3, 'Email must be at leaast 3 characters'),
  });
  
  
  export const updateUserSchema = updateProfileSchema.extend({
    id: z.string().min(1, 'ID is required'),
    role: z.string().min(1, 'Role is required'),
  });
  
 
  export const insertReviewSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    productId: z.string().min(1, 'Product is required'),
    userId: z.string().min(1, 'User is required'),
    rating: z.coerce
      .number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
  });

  export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    category: z.string().min(3, 'Category must be at least 3 characters'),
    brand: z.string().min(3, 'Brand must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Product must have at least one image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
  });
  
  // Schema for updating products
  export const updateProductSchema = insertProductSchema.extend({
    id: z.string().min(1, 'Id is required'),
  });