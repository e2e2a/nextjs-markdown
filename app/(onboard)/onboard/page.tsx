import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { OnboardClient } from './components/onboard-client';

export const metadata: Metadata = {
  title: 'Welcome to MondreyMD — Let’s Get You Onboarded',
  description:
    'Set up your workspace and get started with creating, organizing, and collaborating effortlessly. A simple onboarding flow designed to help you begin quickly and stay productive.',
};

export default function Page() {
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
          <h1 className="text-lg">MondreyMD</h1>
        </Link>
        <OnboardClient />
      </div>
    </div>
  );
}
