import { HttpError } from '@/utils/errors';
import { userRepository } from '@/modules/users/user.repository';
import { IOnboard } from '@/types';
import { Step1Schema, Step2Schema } from '@/lib/validators/onboard';
import { workspaceRepository } from '@/modules/workspaces/workspace.repository';
import { workspaceSchema } from '@/lib/validators/workspace';
import { User } from 'next-auth';
import { workspaceMemberService } from '../workspaces/members/member.service';

export const userServices = {
  onboard: async (data: IOnboard, authUser: User) => {
    const result1 = Step1Schema.safeParse(data.step1);
    const result2 = Step2Schema.safeParse(data.step2);
    const result3 = workspaceSchema.safeParse(data.step3);
    if (!result1.success || !result2.success || !result3.success)
      throw new HttpError('NOT_FOUND', 'Invalid fields.');

    const user = userRepository.updateUserById(authUser._id!, {
      ...result1.data,
      ...result2.data,
      isOnboard: true,
    });

    if (!user) throw new HttpError('NOT_FOUND', 'No user found.');
    const workspace = await workspaceRepository.store({
      ...result3.data,
      ownerUserId: authUser._id!.toString(),
    });

    await workspaceMemberService.initializeOwnership({
      email: authUser.email,
      workspaceId: workspace._id,
    });
    return { workspaceId: workspace._id };
  },
};
