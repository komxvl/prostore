import { DefaultSession } from "next-auth";

declare module 'next-aut' {
    export interface Session {
        user: {
            role: string;
        } & DefaultSession['user']
    }
}