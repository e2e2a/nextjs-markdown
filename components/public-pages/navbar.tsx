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
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import LogoutButton from './logout-button';

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <nav className="fixed top-0 w-full backdrop-blur-sm bg-gray-200 shadow-md z-50">
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
            <DrawerContent className="w-full! backdrop-blur-sm bg-gray-200 border-none">
              <DrawerHeader>
                <DrawerTitle className="flex justify-between">
                  Menu
                  <DrawerClose className="cursor-pointer">
                    <X />
                  </DrawerClose>
                </DrawerTitle>
                <DrawerDescription></DrawerDescription>
              </DrawerHeader>
              <div className="px-5 h-[calc(100vh-60px)] flex flex-col gap-y-0">
                <ul className="flex flex-col gap-y-0 h-full text-black overflow-y-auto">
                  {PagesData.map((item, idx) => (
                    <li key={idx} className="py-2">
                      <Link href={item.href} className="hover:underline block transition w-full">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                  <li className="">
                    {(!session || !session.user) && (
                      <Link
                        href={'/login'}
                        className="cursor-pointer block mt-2 px-3 py-1 text-center text-black hover:bg-white/90 bg-white rounded-xs"
                      >
                        Sign in
                      </Link>
                    )}
                    {(!session || !session.user) && (
                      <div className="">
                        <LogoutButton className="block my-2 w-full px-2! py-[5px]! text-center" />
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <ul className="space-x-6 text-black hidden md:flex">
          {PagesData.map((item, idx) => (
            <li key={idx}>
              <Link href={item.href} className="hover:underline transition">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-end hidden md:flex">
          {(!session || !session.user) && (
            <Link
              href={'/login'}
              className="cursor-pointer rounded-sm px-3 py-1 bg-white hover:bg-white/90 text-black drop-shadow-lg"
            >
              Sign in
            </Link>
          )}
          {session && (
            <div className="flex gap-1 px-3 py-1">
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
