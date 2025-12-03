import { Metadata } from 'next';
import VerifyClient from './components/verify-client';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Verify Email | MarkdownMD',
  description:
    'Verify your email for MarkdownMD. Instantly access your dashboard to create, edit, preview, and collaborate on Markdown documents in real-time. Secure, fast, and built for team productivity.',
};

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading verification details...</div>}>
        <VerifyClient />
      </Suspense>
    </div>
  );
};

export default Page;
