import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {ShoppingCart, UserIcon} from 'lucide-react'
import { APP_NAME } from '@/lib/constants';
import ModeToggle from './mode-toggle';
import Menu from './menu';

const Header = () => {
    return <header className="w-full border-b">
        <div className="wrapper flex-between">
            <div className="flex-start">
                <Link href="/" className='flex-start'>
                <Image src='/images/logo.svg' priority={true} height={48} width={48} alt="logo" />
                <span className="hidden lg:block font-bold text-2xl ml-3">
                    {APP_NAME}
                </span>
                </Link>
            </div>
            <div className="space-x-2">
              <Menu />
            </div>
        </div>
    </header>
}
 
export default Header;