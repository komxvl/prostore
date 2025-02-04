'use client'
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const NotFoundPAge = () => {
    return ( <div className="flex flex-col min-h-screen justify-center items-center">
        <Image src='/images/logo.svg' alt="logo" width={130} height={130} />
        <h1 className="text-3xl font-bold mb-4 mt-4">Page Not Found</h1>
    <Button variant='outline' className="mt-4" onClick={() => {
        window.location.href='/'
    }}>
        Go Home page
    </Button>
    </div> );
}
 
export default NotFoundPAge;