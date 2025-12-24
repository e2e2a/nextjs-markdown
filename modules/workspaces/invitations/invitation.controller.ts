import connectDb from '@/lib/db/connection';
import { invitationServices } from './invitation.service';
import { ensureAuthenticated } from '@/lib/auth-utils';

export const invitaitonController = {
  create: async () => {
    return;
  },
  getMyInvitations: async () => {
    await connectDb();
    const session = await ensureAuthenticated();

    return await invitationServices.getPendingInvitations({ email: session.user.email });
  },
};
