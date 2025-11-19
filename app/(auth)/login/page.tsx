import { LoginForm } from '@/app/(auth)/login/components/login-form';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Sign In for Collaborative Markdown Editor',
  description:
    'Access your account to create, preview, and collaborate on Markdown documents in real time. Fast, secure, and simple login for team productivity.',
};

export default function LoginPage() {
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
        <LoginForm />
      </div>
    </div>
  );
}
