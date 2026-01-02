import { HttpError } from '@/utils/errors';
import { memberRepository } from '@/repositories/member';
import { nodeRepository } from '@/repositories/node';
import { projectRepository } from '@/modules/projects/project.repository';
import { INode, ProjectPushNodeDTO } from '@/types';
import { Session, User } from 'next-auth';
import { projectMemberService } from './member/member.service';
import { projectMemberRepository } from '@/modules/projects/member/member.repository';
import mongoose from 'mongoose';
import { ensureWorkspaceMember } from '../workspaces/workspace.context';

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
      members?: { email: string; role: 'owner' | 'editor' | 'viewer' }[];
    }
  ) => {
    const { workspaceId, title, members } = data;
    await ensureWorkspaceMember(data.workspaceId, user.email);

    await projectService.checkTitleExist(workspaceId, title);
    const newProject = await projectRepository.create({
      workspaceId,
      title,
      createdBy: user._id!.toString(),
    });
    await projectMemberService.addOwner({
      workspaceId,
      projectId: newProject._id as string,
      email: user.email,
    });

    if (members && members.length > 0) {
      const membersDataToCreate = members.map(member => ({
        ...member,
        projectId: newProject._id.toString(),
        workspaceId,
      }));
      await projectMemberService.create(user, membersDataToCreate);
    }

    return { project: newProject };
  },

  checkTitleExist: async (workspaceId: string, title: string) => {
    const existingProjectTitle = await projectRepository.findProjectByTitle(workspaceId, title);
    if (existingProjectTitle) throw new HttpError('CONFLICT', 'Project title already exists.');
    return;
  },

  getMyWorkspaceProjects: async (workspaceId: string, email: string) => {
    const { role } = await ensureWorkspaceMember(workspaceId, email);
    if (role === 'owner') return await projectRepository.findMany({ workspaceId });

    return await projectMemberRepository.findProjects({
      workspaceId,
      email,
    });
  },

  getAllProjects: (email: string) => projectMemberRepository.findProjects({ email }),

  update: async (projectId: string, email: string, dataToUpdate: { title: string }) => {
    const project = await projectRepository.findOne({ _id: projectId });
    if (!project) throw new HttpError('NOT_FOUND', 'No project to be updated.');

    const { permissions } = await ensureWorkspaceMember(project.workspaceId, email);
    if (!permissions.canEditProject) throw new HttpError('FORBIDDEN');
    await projectService.checkTitleExist(project.workspaceId, dataToUpdate.title);
    await projectRepository.updateOne({ _id: projectId }, dataToUpdate);

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
