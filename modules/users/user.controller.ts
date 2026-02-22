import { ensureAuthenticated } from '@/lib/server/auth-utils';
import { userServices } from './user.service';
import { IOnboard } from '@/types';

export const userController = {
  onboard: async (body: IOnboard) => {
    const session = await ensureAuthenticated();

    return await userServices.onboard(body, session.user);
  },

  getCurrentUser: async () => {
    const session = await ensureAuthenticated();
    return await userServices.getCurrentUser(session.user);
  },
};
