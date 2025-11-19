'use client';
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
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';

const Navbar = () => {
  const { status } = useSession();
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
              <div className="grid grid-cols-1 px-5">
                <ul className="grid grid-cols-1 text-black">
                  {PagesData.map((item, idx) => (
                    <li key={idx} className="py-2 ">
                      <Link href={item.href} className="hover:underline block transition w-full">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                  <li className="">
                    {status === 'unauthenticated' && (
                      <Link
                        href={'/login'}
                        className="cursor-pointer block mt-2 px-3 py-1 text-center text-black hover:bg-white/90 bg-white rounded-xs"
                      >
                        Sign in
                      </Link>
                    )}
                    {status === 'authenticated' && (
                      <div className="">
                        <Button
                          onClick={() => signOut()}
                          variant={'ghost'}
                          className="block mb-2 h-auto w-full cursor-pointer font-medium rounded-xs px-2! py-[5px]! bg-white hover:bg-white/90 text-black drop-shadow-lg"
                        >
                          Log Out
                        </Button>
                        <Link
                          href={'/project'}
                          className="cursor-pointer block text-center w-full rounded-xs px-3 py-1 hover:brightness-125 font-medium bg-linear-to-r from-slate-950 to-slate-700 text-white drop-shadow-lg"
                        >
                          My workspace
                        </Link>
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
          {status === 'unauthenticated' && (
            <Link
              href={'/login'}
              className="cursor-pointer rounded-sm px-3 py-1 bg-white hover:bg-white/90 text-black drop-shadow-lg"
            >
              Sign in
            </Link>
          )}
          {status === 'authenticated' && (
            <div className="flex gap-1">
              <Button
                onClick={() => signOut()}
                variant={'ghost'}
                className="block h-auto cursor-pointer font-medium rounded-sm px-2! py-[5px]! text-black drop-shadow-lg"
              >
                Log Out
              </Button>
              <Link
                href={'/project'}
                className="cursor-pointer rounded-sm px-2 py-1 hover:brightness-125 font-medium bg-linear-to-tr from-slate-950 to-slate-700 text-white drop-shadow-lg"
              >
                My workspace
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
