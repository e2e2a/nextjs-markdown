import { HttpError } from '@/lib/error';
import { memberRepository } from '@/repositories/member';
import { nodeRepository } from '@/repositories/node';
import { projectRepository } from '@/repositories/project';
import { INode, IProject, ProjectPushNodeDTO } from '@/types';
import { Session, User } from 'next-auth';
import { projectMemberService } from './projectMember';
import { projectMemberRepository } from '@/repositories/projectMember';
import mongoose from 'mongoose';
import { projectSchema } from '@/lib/validators/project';
import { workspaceMemberService } from './workspaceMember';

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
    const { workspaceId, title } = data;
    await workspaceMemberService.getMembership({ workspaceId, email: user.email });
    if (!mongoose.Types.ObjectId.isValid(workspaceId))
      throw new HttpError('Invalid workspace ID.', 400);

    const res = projectSchema.safeParse({ title });
    if (!res.success) throw new HttpError('Invalid fields.', 400);

    await projectService.checkTitleExist(workspaceId, title);
    const newProject = await projectRepository.create({
      workspaceId,
      title,
      createdBy: user._id!.toString(),
    });
    if (!newProject) throw new HttpError('Semething went wrong.', 500);

    await projectService.createMemberInNewProject(user, data, newProject._id);

    return newProject;
  },

  checkTitleExist: async (workspaceId: string, title: string) => {
    const existingProjectTitle = await projectRepository.findProjectByTitle(workspaceId, title);
    if (existingProjectTitle) throw new HttpError('Project title already exists.', 409);
    return;
  },

  createMemberInNewProject: async (
    user: User,
    data: {
      workspaceId: string;
      members: { email: string; role: 'owner' | 'editor' | 'viewer' }[];
    },
    projectId: string
  ) => {
    const { workspaceId, members } = data;
    if (members.length > 0) {
      const membersDataToCreate = members.map(member => ({
        ...member,
        projectId,
        workspaceId,
      }));
      const newMembers = await projectMemberService.create(user, membersDataToCreate);
      if (!newMembers) throw new HttpError('Semething went wrong.', 500);
    }
    return true;
  },

  async getMyWorkspaceProjects(workspaceId: string, email: string) {
    const membership = await workspaceMemberService.getMembership({ workspaceId, email });
    if (membership.role === 'owner') return await projectRepository.find(workspaceId);

    return await projectMemberRepository.findProjectsByMember({
      workspaceId,
      email,
    });
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
      if (!member) throw new HttpError(`Forbidden.`, 403);
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

  updateProjectById: async (id: string, data: Partial<IProject>) => {
    // if (data.title) {
    //   await checkExistence({
    //     userId: data.userId!,
    //     title: data.title || '',
    //   });
    // }
    if (data.archived) return projectRepository.archiveById(id, data);
    return projectRepository.updateProjectById(id, data);
  },

  pullNode: async (dataToFind: { _id: string; userId: string }, data: { nodes: string[] }) => {
    return projectRepository.pullNode(dataToFind, data);
  },
};
