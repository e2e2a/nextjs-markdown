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
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/images/logo.png"
            alt="Hero Background"
            width={500}
            height={500}
            className="h-7 w-7 rounded-sm"
          />
          Mondrey
        </Link>
        <LoginForm session={session as Session} />
      </div>
    </div>
  );
}
