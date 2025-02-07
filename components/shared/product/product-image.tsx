'use client'
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";


const ProductImages = ({images} : {images: string[]}) => {
    const [current, setCurrent] = useState<number>(0)
    return ( <div className="space-y-4">
        <Image src={images[current]} alt="logo" width={1000} height={1000} className='min-h-[300px] object-cover object-center'  />
        <div className="flex">
            {images.map((item, index) => (
                <div key={item}onClick={() => setCurrent(index)} className={cn('border mr-2 cursor-pointer hover:border-orange-400', current === index && 'border-orange-600')} >
                     <Image src={item} alt="logo" width={50} height={50} className=' min-h-[50px] object-cover object-center'  />
                </div>
            ))}
        </div>
    </div> );
}
 
export default ProductImages;