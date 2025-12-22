import { HttpError } from '@/lib/error';
import { workspaceMemberRepository } from '@/repositories/workspaceMember';
import mongoose from 'mongoose';
import { workspaceMemberServices } from './workspaceMember';
import { User } from 'next-auth';
import { IWorkspaceMemberCreateDTO } from '@/types';
import { projectMemberService } from './projectMember';
import { MembersSchema } from '@/lib/validators/workspaceMember';

export const invitationServices = {
  /**
   * Permission rules:
   * 1. Workspace roles:
   *    - owner or editor can invite members (workspace and project invitations)
   *    - viewer cannot invite members
   *
   * 2. Project roles:
   *    - owner or editor permissions apply only to actions inside the project content
   *      (e.g., creating/editing/deleting nodes or files)
   *    - project roles do NOT override workspace-level permissions
   *      (e.g., inviting members or renaming the project is blocked for workspace viewers)
   */
  create: async (
    user: User,
    data: {
      workspaceId: string;
      projectId?: string;
      members: IWorkspaceMemberCreateDTO[];
    }
  ) => {
    const { workspaceId, projectId, members } = data;

    const res = MembersSchema.safeParse(members);
    if (!res.success) throw new HttpError('Invalid member fields.', 400);

    if (members.length > 0) throw new HttpError('No Member to be invited.', 400);

    const membership = await workspaceMemberServices.getMembership({
      workspaceId,
      email: user.email,
    });

    const roles = ['editor', 'owner'];
    if (!roles.includes(membership.role))
      throw new HttpError('You do not have permission to invite members.', 403);

    const initialMembersData = members.map(member => ({ ...member, workspaceId }));
    if (!projectId) {
      const workspaceMembers = initialMembersData.map(m => ({ ...m, invitedBy: user.email }));
      await workspaceMemberServices.create(workspaceMembers);
    } else {
      if (!mongoose.Types.ObjectId.isValid(projectId))
        throw new HttpError('Invalid project ID.', 400);
      const workspaceMembers = initialMembersData.map(m => ({ ...m, projectId }));
      await projectMemberService.create(user, workspaceMembers);
    }
    return true;
  },

  getUserInvitations: async (data: { email: string }) => {
    const workspaces = await workspaceMemberRepository.findByEmailAndStatus(
      { email: data.email, status: 'pending' },
      { workspaceId: true, invitedBy: true }
    );
    return workspaces;
  },

  accept: async (data: { email: string; _id: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data._id))
      throw new HttpError('Invalid workspace ID.', 400);

    const res = await workspaceMemberRepository.updateByIdAndEmail(data, {
      status: 'accepted',
    });
    if (!res) throw new HttpError('No workspace member to be updated.', 404);
    return;
  },

  decline: async (data: { _id: string; email: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data._id))
      throw new HttpError('Invalid workspace ID.', 400);
    const res = await workspaceMemberRepository.deleteByIdAndEmail(data);
    if (!res) throw new HttpError('No workspace member to be deleted.', 404);
  },
};
