import { HttpError } from '@/lib/error';
import { workspaceRepository } from '@/repositories/workspace';
import { IWorkspace, IWorkspaceMemberCreateDTO } from '@/types';
import { workspaceMemberService } from './workspaceMember';
import { User } from 'next-auth';
import { workspaceMemberRepository } from '@/repositories/workspaceMember';
import mongoose from 'mongoose';
import { projectRepository } from '@/repositories/project';
import { projectSchema } from '@/lib/validators/project';
import { projectService } from './project';

export const workspaceService = {
  create: async (user: User, workspace: IWorkspace, members: IWorkspaceMemberCreateDTO[]) => {
    const newWorkspace = await workspaceRepository.create(workspace, user);
    if (!newWorkspace) throw new HttpError('Semething went wrong.', 500);

    if (members.length > 0) {
      const membersDataToCreate = members.map(member => ({
        ...member,
        invitedBy: user._id!.toString(),
        workspaceId: newWorkspace._id!.toString(),
      }));
      const newMembers = await workspaceMemberService.create(membersDataToCreate);
      if (!newMembers) throw new HttpError('Something went wrong.', 500);
    }

    return newWorkspace;
  },

  createProject: async (
    data: {
      title: string;
      workspaceId: string;
      members: {
        role: 'owner' | 'editor' | 'viewer';
        email: string;
      }[];
    },
    user: User
  ) => {
    console.log('run', data);
    const { workspaceId, title } = data;
    if (!mongoose.Types.ObjectId.isValid(workspaceId))
      throw new HttpError('Invalid workspace ID.', 400);

    const res = projectSchema.safeParse({ title });
    if (!res.success) throw new HttpError('Invalid fields.', 400);

    const existingProjectTitle = await projectRepository.findProjectByTitle(workspaceId, title);
    if (existingProjectTitle) throw new HttpError('Project title already exists.', 409);

    const project = await projectService.create(user, data);
    if (!project) throw new HttpError('Something went wrong.', 500);

    return { project: project._id };
  },

  getWorkspaceMembers: async (data: { workspaceId: string; email: string }) => {
    const workspaces = await workspaceMemberRepository.findMembers(data);
    return workspaces;
  },

  getUserWorkspaces: async (email: string) => {
    const workspaces = await workspaceMemberRepository.findByEmailAndStatus(
      { email, status: 'accepted' },
      { workspaceId: true }
    );
    return workspaces;
  },

  getUserWorkspaceProjects: async (workspaceId: string, email: string) => {
    const membership = await workspaceMemberRepository.findOneMembership({
      workspaceId,
      email,
    });

    if (!membership) throw new HttpError('You are not a member of this workspace.', 403);

    return membership;
  },

  leave: async (data: { workspaceId: string; userId: string }) => {
    if (!mongoose.Types.ObjectId.isValid(data.workspaceId))
      throw new HttpError('Invalid workspace ID.', 400);

    const res = await workspaceMemberRepository.deleteByWorkspaceIdAndUserId(data);
    if (!res) throw new HttpError('No workspace member to be deleted.', 404);
  },
};
