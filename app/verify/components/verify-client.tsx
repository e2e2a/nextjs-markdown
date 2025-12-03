'use client';
import { VerifyForm } from './verify-form';
import Image from 'next/image';
import Link from 'next/link';
import { useTokenQueryByToken } from '@/hooks/token/userTokenQuery';
import { notFound, useSearchParams } from 'next/navigation';

const VerifyClient = () => {
  const searchParams = useSearchParams();
  const tokenValue = searchParams.get('token');
  const { data, isLoading, error } = useTokenQueryByToken(tokenValue as string);

  if (!tokenValue) return notFound();
  if (isLoading) return <div>loading</div>;
  if (error) return notFound();
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
        <VerifyForm tokenValue={tokenValue || ''} expiresCode={data.expiresCode} />
      </div>
    </div>
  );
};

export default VerifyClient;
