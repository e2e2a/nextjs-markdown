import { ensureAuthenticated } from '@/lib/auth-utils';
import { userServices } from './user.service';
import { IOnboard } from '@/types';

export const userController = {
  onboard: async (body: IOnboard) => {
    const session = await ensureAuthenticated();

    const res = await userServices.onboard(body, session.user);
    return res;
  },
};
