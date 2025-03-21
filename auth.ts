import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import type { NextAuthConfig } from 'next-auth'
import { prisma } from '@/db/prisma'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'


export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
            strategy: 'jwt',
            maxAge: 30 * 24 * 60 * 60, 
            
    },
    adapter: PrismaAdapter(prisma),
    providers: [CredentialsProvider({
            credentials: {
                email: {type: 'email'},
                password: {type: 'password'}
            },

            //@ts-ignore
    async authorize(credentials) {
        if(credentials == null) return null
        const user = await prisma.user.findFirst({
            where: {
                email: credentials.email as string
            }
        })

        if(user && user.password) {
            const isMatch = compareSync(credentials.password as string, user.password)
            if(isMatch) {
                return {
                    id:user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        }
        return null
    }
        })],
    callbacks: {
        async session({ session,  user, trigger, token }: any) {
        
            session.user.id = token.sub
            session.user.role = token.role
            session.user.name = token.name

            if(trigger === 'update') {
                session.user.name = user.name
            }


          return session
        },

        async jwt({ token, user, trigger, session }: any) {
            // Assign user fields to token
            if (user) {
              token.id = user.id;
              token.role = user.role;
      
              // If user has no name then use the email
              if (user.name === 'NO_NAME') {
                token.name = user.email!.split('@')[0];
      
                // Update database to reflect the token name
                await prisma.user.update({
                  where: { id: user.id },
                  data: { name: token.name },
                });
              }
      
              if (trigger === 'signIn' || trigger === 'signUp') {
                const cookiesObject = await cookies();
                const sessionCartId = cookiesObject.get('sessionCartId')?.value;
      
                if (sessionCartId) {
                  const sessionCart = await prisma.cart.findFirst({
                    where: { sessionCartId },
                  });
      
                  if (sessionCart) {
                    // Delete current user cart
                    await prisma.cart.deleteMany({
                      where: { userId: user.id },
                    });
      
                    // Assign new cart
                    await prisma.cart.update({
                      where: { id: sessionCart.id },
                      data: { userId: user.id },
                    });
                  }
                }
              }
            }
      
            // Handle session updates
            if (session?.user.name && trigger === 'update') {
              token.name = session.user.name;
            }
      
            return token;
          },
authorized({request, auth}: any) {
    const {pathName} = request.nextUrl

    
    


    const protectedPath = [ /\/shipping-address/, /\/admin/]

    if(!auth && protectedPath.some((p) => p.test(pathName))) return false


    if(!request.cookies.get('sessionCartId')) {
            const sessionCartId = crypto.randomUUID()
           const newRequestHeaders = new Headers(request.headers)
           const response = NextResponse.next({
            request:{
                headers: newRequestHeaders
            }
           })
           response.cookies.set('sessionCartId', sessionCartId)
           return response
    }else {
        return true
    }
}
      }
} satisfies NextAuthConfig

export const {handlers, auth, signIn, signOut} = NextAuth(config)