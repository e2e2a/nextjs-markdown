import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'MondreyMD',
    template: '%s | MondreyMD',
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session?.user.kbaVerified) redirect('/login');

  return <div className="overflow-y-hidden">{children}</div>;
}
