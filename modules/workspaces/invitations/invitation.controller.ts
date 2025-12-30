import { invitationServices } from './invitation.service';
import { ensureAuthenticated } from '@/lib/auth-utils';
import { IWorkspaceMemberCreateDTO } from '@/types';

export const invitationController = {
  create: async (data: {
    workspaceId: string;
    projectId: string;
    members: IWorkspaceMemberCreateDTO[];
  }) => {
    const session = await ensureAuthenticated();
    await invitationServices.create(session.user, data);
    return null;
  },

  acceptInvitationForUser: async (invitationId: string) => {
    const session = await ensureAuthenticated();
    await invitationServices.accept({
      _id: invitationId,
      email: session.user.email,
    });
    return { invitationId };
  },

  rejectInvitationForUser: async (invitationId: string) => {
    const session = await ensureAuthenticated();
    await invitationServices.reject({
      _id: invitationId,
      email: session.user.email,
    });
    return { invitationId };
  },

  delete: async (invitationId: string) => {
    /**
     * @todo
     * This action means other user from workspace can delete the invitation
     */
    const session = await ensureAuthenticated();
    await invitationServices.delete({
      _id: invitationId,
      email: session.user.email,
    });
    return { invitationId };
  },

  getMyInvitations: async () => {
    const session = await ensureAuthenticated();
    const invitations = await invitationServices.getPendingInvitations({
      email: session.user.email,
    });
    return { invitations };
  },
};
