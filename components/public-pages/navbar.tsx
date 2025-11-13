import Link from 'next/link';
import Image from 'next/image';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu, X } from 'lucide-react';
import { PagesData } from '@/data/publicNavbar';

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full backdrop-blur-lg bg-white/30 shadow-md z-50">
      <div className="py-2 px-6 flex justify-between items-center">
        <Link
          href={'/'}
          className="text-xl lg:text-2xl gap-2 flex items-center font-extrabold tracking-tight text-gray-900"
        >
          <Image
            src="/images/logo.png"
            alt="Hero Background"
            width={500}
            height={500}
            className="h-9 w-9 rounded-sm"
          />
          MondreyMD
        </Link>
        <div className="md:hidden">
          <Drawer direction="right">
            <DrawerTrigger title="Menu" className="cursor-pointer">
              <Menu />
            </DrawerTrigger>
            <DrawerContent className="w-full! backdrop-blur-sm bg-white/85 border-none">
              <DrawerHeader>
                <DrawerTitle className="flex justify-between">
                  Menu
                  <DrawerClose className="cursor-pointer">
                    <X />
                  </DrawerClose>
                </DrawerTitle>
                <DrawerDescription></DrawerDescription>
              </DrawerHeader>
              <div className="grid grid-cols-1 px-5">
                <ul className="grid grid-cols-1 text-gray-700">
                  {PagesData.map((item, idx) => (
                    <li key={idx} className="py-2 ">
                      <Link href={item.href} className="hover:underline block transition w-full">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                  <li className="">
                    <Link
                      href={'/login'}
                      className="cursor-pointer block hover:brightness-125 mt-2 px-5 py-2 bg-linear-to-r text-center from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition"
                    >
                      Sign in
                    </Link>
                  </li>
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <ul className="space-x-6 text-gray-700 hidden md:flex">
          {PagesData.map((item, idx) => (
            <li key={idx}>
              <Link href={item.href} className="hover:underline transition">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-end hidden md:flex">
          <Link
            href={'/login'}
            className="cursor-pointer hover:brightness-125 px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition"
          >
            Sign in
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
