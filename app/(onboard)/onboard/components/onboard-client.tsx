import { getServerSession } from 'next-auth';
import { OnboardForms } from './onboard-forms';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { OnboardComplete } from './onboard-complete';

export async function OnboardClient() {
  const session = await getServerSession(authOptions);
  return (
    <div className="w-full flex justify-center p-6">
      {session && session.user?.isOnboard ? <OnboardComplete /> : <OnboardForms />}
    </div>
  );
}
