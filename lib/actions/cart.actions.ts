'use server';

import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/db/prisma';

const calcPrice = (items: CartItem[]) => {
  console.log("ITEMS", items)
  const itemsPrice = round2(
    items.reduce((acc, item) => acc  + Number(item.price) * item.qty, 0))
    console.log("!!!!!!!", itemsPrice)
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
    const taxPrice = round2(0.15* itemsPrice)
    const  totalPrice = round2(itemsPrice + taxPrice + shippingPrice)

    return {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    }
}


export async function addItemToCart(data: CartItem) {
  try {
const sessionCartId = (await cookies()).get('sessionCartId')?.value
if(!sessionCartId) throw new Error('Error')

const session = await auth();
const userId = session?.user?.id ? ( session.user.id as string) : undefined


const cart = await getMyCart()
const item = cartItemSchema.parse(data)

const product = await prisma.product.findFirst({
  where: {id: item.productId }
})

if(!product) throw new Error('Product not found')
  
  if(!cart) {
    const newCart = insertCartSchema.parse({
      userId: userId,
      items: [item],
      sessionCartId: sessionCartId,
      ...calcPrice([item])
    })
    console.log(newCart)

await prisma.cart.create({
  data: newCart
});

revalidatePath(`/product/${product.slug}`)
return {
  success: true,
  message: `${product.name} added to cart`
}
  } else {
      const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId)
      if(existItem) {
        if(product.stock < existItem.qty + 1) {
          throw new Error('Not enought stock')
        }
        (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = existItem.qty +1
  
      } else {
        if(product.stock < 1) throw new Error("Error")
          cart.items.push(item)
      }

      await prisma.cart.update({
        where: {id: cart.id},
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[])
        }
      })
      revalidatePath(`/product/${product.slug}`)
      return {
        success: true,
        message: `${product.name} ${existItem ? 'update in' : 'added to'} cart`
      }
  }




 
} catch(error) {
  return {
    success: false,
    message: formatError(error)
  }
}
}


export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value
if(!sessionCartId) throw new Error('Error')

const session = await auth();
const userId = session?.user?.id ? ( session.user.id as string) : undefined
  console.log(sessionCartId);

  const cart = await prisma.cart.findFirst({
    where: userId? {userId: userId} : {sessionCartId : sessionCartId}
  })

  if(!cart) return undefined

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString()
  })
  
}

export async function removeItemFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if(!sessionCartId) throw new Error("sessionCartId not found")

const product = await prisma.product.findFirst({
  where : {id: productId}
})

if(!product) throw new Error('Product not found')

  const cart = await getMyCart()
  if(!cart) throw new Error('Not Cart')

    const exist = (cart.items as CartItem[]).find((x) => x.productId === productId)
    if(!exist)  throw new Error('Not item')

      if(exist.qty == 1) {
        cart.items = cart.items.filter((x) => x.productId != productId)
      } else {
        (cart.items as CartItem[]).find((x) => x.productId == productId)!.qty = exist.qty - 1
      }

      await prisma.cart.update({
        where: {id: cart.id},
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[])
        }
      })

      revalidatePath(`/product/${product.slug}`)
      return {
        success: true,
        message: `${product.name} removed from cart`
      }

  } catch(error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}