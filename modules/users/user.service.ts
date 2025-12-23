import { HttpError } from '@/lib/error';
import { userRepository } from '@/modules/users/user.repository';
import { IOnboard } from '@/types';
import { Step1Schema, Step2Schema } from '@/lib/validators/onboard';
import { workspaceRepository } from '@/modules/workspaces/workspace.repository';
import { workspaceSchema } from '@/lib/validators/workspace';
import { workspaceMemberRepository } from '@/modules/workspaces/members/member.repository';
import { User } from 'next-auth';

export const userServices = {
  onboard: async (data: IOnboard, authUser: User) => {
    const result1 = Step1Schema.safeParse(data.step1);
    const result2 = Step2Schema.safeParse(data.step2);
    const result3 = workspaceSchema.safeParse(data.step3);
    if (!result1.success || !result2.success || !result3.success)
      throw new HttpError('Invalid fields.', 400);

    const user = userRepository.updateUserById(authUser._id!, {
      ...result1.data,
      ...result2.data,
      isOnboard: true,
    });

    if (!user) throw new HttpError('No user found.', 404);
    const workspace = await workspaceRepository.create(
      { ...result3.data, ownerUserId: authUser._id!.toString() },
      authUser
    );

    if (!workspace) throw new HttpError('Something went wrong.', 500);
    return { workspaceId: workspace._id };
  },

  getUserInvitations: async (data: { email: string }) => {
    const workspaces = await workspaceMemberRepository.findByEmailAndStatus(
      { email: data.email, status: 'pending' },
      { workspaceId: true, invitedBy: true }
    );
    return workspaces;
  },
};
