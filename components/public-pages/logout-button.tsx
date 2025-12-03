'use client';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface IProps {
  className?: string;
}

const LogoutButton = ({ className }: IProps) => {
  return (
    <>
      <Button
        onClick={() => signOut()}
        variant={'ghost'}
        className={cn(
          ' h-auto  cursor-pointer font-medium rounded-xs bg-white hover:bg-white/90 text-black drop-shadow-lg',
          className
        )}
      >
        Log Out
      </Button>
      <Link
        href={'/project'}
        className={cn(
          'cursor-pointer rounded-sm px-2 py-1 hover:brightness-125 font-medium bg-linear-to-tr from-slate-950 to-slate-700 text-white drop-shadow-lg',
          className
        )}
      >
        My workspace
      </Link>
    </>
  );
};

export default LogoutButton;
