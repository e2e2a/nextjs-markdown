import { HttpError } from '@/utils/errors';
import { memberRepository } from '@/repositories/member';
import { nodeRepository } from '@/repositories/node';
import { projectRepository } from '@/modules/projects/project.repository';
import { INode, ProjectPushNodeDTO } from '@/types';
import { Session, User } from 'next-auth';
import { projectMemberService } from './member/member.service';
import { projectMemberRepository } from '@/repositories/projectMember';
import mongoose from 'mongoose';
import { projectSchema } from '@/lib/validators/project';
import { workspaceMemberServices } from '../workspaces/members/member.service';
import { MembersSchema } from '@/lib/validators/workspaceMember';

const sortNodes = (nodes: INode[]) => {
  return [...nodes].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.title!.localeCompare(b.title!, undefined, { sensitivity: 'base' });
  });
};

export const projectService = {
  create: async (
    user: User,
    data: {
      title: string;
      workspaceId: string;
      members: { email: string; role: 'owner' | 'editor' | 'viewer' }[];
    }
  ) => {
    const { workspaceId, title, members } = data;
    await workspaceMemberServices.getMembership({ workspaceId, email: user.email });

    const res = projectSchema.safeParse({ title });
    if (!res.success) throw new HttpError('BAD_INPUT', 'Invalid fields.');

    const resM = MembersSchema.safeParse(members);
    if (!resM.success) throw new HttpError('BAD_INPUT', 'Invalid member fields.');

    await projectService.checkTitleExist(workspaceId, title);
    const newProject = await projectRepository.create({
      workspaceId,
      title,
      createdBy: user._id!.toString(),
    });

    if (resM.data.length > 0) {
      const membersDataToCreate = resM.data.map(member => ({
        ...member,
        projectId: newProject._id.toString(),
        workspaceId,
      }));
      await projectMemberService.create(user, membersDataToCreate);
    }

    return newProject;
  },

  checkTitleExist: async (workspaceId: string, title: string) => {
    const existingProjectTitle = await projectRepository.findProjectByTitle(workspaceId, title);
    if (existingProjectTitle) throw new HttpError('CONFLICT', 'Project title already exists.');
    return;
  },

  async getMyWorkspaceProjects(workspaceId: string, email: string) {
    const membership = await workspaceMemberServices.getMembership({ workspaceId, email });
    if (membership.role === 'owner') return await projectRepository.find(workspaceId);

    return await projectMemberRepository.findProjectsByMember({
      workspaceId,
      email,
    });
  },

  updateProjectTitle: async (projectId: string, title: string, user: User) => {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      throw new HttpError('BAD_INPUT', 'Invalid project ID.');
    await projectMemberService.getMembership({ projectId, email: user.email });

    const res = projectSchema.safeParse({ title });
    if (!res.success) throw new HttpError('BAD_INPUT', 'Invalid fields.');

    const project = await projectRepository.updateProjectTitle(projectId, title);
    if (!project) throw new HttpError('NOT_FOUND', 'No project to be updated.');

    return project;
  },

  deleteProject: async (projectId: string, user: User) => {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      throw new HttpError('BAD_INPUT', 'Invalid project ID.');

    await projectMemberService.getMembership({ projectId, email: user.email });

    const project = await projectRepository.deleteOne(projectId);
    if (!project) throw new HttpError('NOT_FOUND', 'No project to be deleted.');

    return project;
  },

  findProject: async (session: Session, id: string) => {
    const project = await projectRepository.findProject(id);
    if (!project) return null;
    if (project.userId.toString() !== session.user._id) {
      const member = await memberRepository.getMember({
        projectId: project._id,
        email: session.user.email,
        status: 'accepted',
      });
      if (!member) throw new HttpError('FORBIDDEN', `Forbidden.`);
    }
    if (project.archived?.isArchived) return null;

    // Skip if no nodes
    if (!project.nodes || project.nodes.length === 0) return project;

    // ✅ Filter only parent (top-level) nodes that aren't archived
    const parentNodes = (project.nodes as INode[]).filter(
      node => node.parentId === null && !node.archived?.isArchived
    );

    // ✅ Recursive helper to populate children (skip archived ones)
    const populateChildrenRecursively = async (nodeId: string): Promise<INode | null> => {
      const node = await nodeRepository.findNode(nodeId);
      if (!node) return null;
      if (node.archived?.isArchived) return null;

      if (node.children && node.children.length > 0) {
        const children = await Promise.all(
          node.children.map((child: INode) => populateChildrenRecursively(child._id.toString()))
        );

        node.children = children.filter(Boolean) as INode[];
        node.children = sortNodes(node.children);
      }

      return node;
    };

    // ✅ Sort and populate top-level nodes
    const sortedTopLevelNodes = sortNodes(parentNodes);
    const populatedNodes = await Promise.all(
      sortedTopLevelNodes.map(n => populateChildrenRecursively(n._id.toString()))
    );

    // ✅ Filter out archived/null nodes and assign back
    project.nodes = populatedNodes.filter(Boolean) as INode[];

    return project;
  },

  pushNode: async (id: string, data: ProjectPushNodeDTO) => {
    return projectRepository.pushNode(id, data);
  },

  findProjectsByUserId: async (userId: string) => projectRepository.findProjectsByUserId(userId),

  pullNode: async (dataToFind: { _id: string; userId: string }, data: { nodes: string[] }) => {
    return projectRepository.pullNode(dataToFind, data);
  },
};
