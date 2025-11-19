'use client';
import { LoginForm } from '@/app/(auth)/login/components/login-form';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return;
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full flex-col items-center gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/images/logo.png"
            alt="MondreyMD Logo"
            width={200}
            height={200}
            priority
            className="h-auto w-[42px] rounded-sm"
          />
          <h1 className="text-lg">Mondrey</h1>
        </Link>
        <LoginForm session={session as Session} />
      </div>
    </div>
  );
}
