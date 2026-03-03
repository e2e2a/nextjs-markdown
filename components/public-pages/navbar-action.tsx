'use client';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface IProps {
  menu: boolean;
}

const NavbarAction = ({ menu }: IProps) => {
  if (menu)
    return (
      <div className="flex flex-col gap-6">
        <li>
          <Button
            onClick={() => signOut()}
            variant={'link'}
            className={cn(
              'cursor-pointer text-start text-lg text-foreground hover:text-primary no-underline hover:no-underline items-start w-full justify-start px-0 rounded-md py-2 font-semibold transition-colors'
            )}
          >
            Log Out
          </Button>
        </li>
        <li>
          <Link href={'/preferences/workspaces'} onClick={() => signOut()} className="hover:text-primary font-bold transition-colors">
            My workspace
          </Link>
        </li>
      </div>
    );
  return (
    <div className="h-14 gap-x-2 flex flex-row items-center justify-center">
      <Button
        onClick={() => signOut()}
        variant={'link'}
        className={
          'cursor-pointer w-fit text-start text-lg text-foreground hover:text-primary font-normal h-fit no-underline hover:no-underline items-start justify-start px-0 rounded-md py-2 transition-colors'
        }
      >
        Log Out
      </Button>
      <Separator orientation="vertical" className="p-px" />
      <Link href={'/preferences/workspaces'} className="hover:text-primary text-lg transition-colors w-fit">
        My workspace
      </Link>
    </div>
  );
};

export default NavbarAction;
