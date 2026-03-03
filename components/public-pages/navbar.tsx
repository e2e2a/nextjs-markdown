'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Menu, X } from 'lucide-react';
import { PagesData } from '@/data/publicNavbar';
import LogoutButton from './logout-button';

export const Navbar = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Styles
  const navStyles = isScrolled ? 'bg-background/80 backdrop-blur-md border-b shadow-sm py-2' : 'bg-transparent py-4';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-0 h-20 flex items-center ${navStyles}`}>
      <div className="w-full flex items-center justify-center px-6">
        <div className="flex justify-between items-center max-w-280 w-full">
          {/* Logo Section */}
          <div className="flex flex-row items-center gap-8">
            <Link href={'/'} className="text-xl lg:text-2xl gap-2 flex items-center font-extrabold tracking-tight text-foreground">
              <Image src="/images/logo-v1.png" alt="Logo" width={64} height={64} className="h-12 w-12 rounded-sm" />
              MondreyMD
            </Link>

            {/* Desktop Menu */}
            <ul className="space-x-6 text-foreground hidden md:flex font-medium">
              {PagesData.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Auth/Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!session ? (
              <Link href={'/login'} className="rounded-md px-5 py-2 bg-white hover:bg-white/90 text-black font-semibold shadow-md transition">
                Sign in
              </Link>
            ) : (
              <LogoutButton />
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Drawer direction="right">
              <DrawerTrigger title="Menu" className="cursor-pointer p-2">
                <Menu className="h-6 w-6" />
              </DrawerTrigger>
              <DrawerContent className="h-full w-80 ml-auto bg-sidebar border-l">
                <DrawerHeader className="border-b">
                  <DrawerTitle className="flex justify-between items-center">
                    Menu
                    <DrawerClose className="cursor-pointer">
                      <X className="h-6 w-6" />
                    </DrawerClose>
                  </DrawerTitle>
                </DrawerHeader>

                <div className="p-6 flex flex-col h-full">
                  <ul className="flex flex-col gap-4 text-foreground text-lg font-medium">
                    {PagesData.map((item, idx) => (
                      <li key={idx}>
                        <Link href={item.href} className="block py-2 hover:text-primary">
                          {item.title}
                        </Link>
                      </li>
                    ))}
                    <hr className="my-2 border-border" />
                    {!session ? (
                      <Link href={'/login'} className="w-full py-3 text-center bg-white text-black rounded-md">
                        Sign in
                      </Link>
                    ) : (
                      <LogoutButton className="w-full py-3" />
                    )}
                  </ul>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
