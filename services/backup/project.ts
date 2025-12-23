import { HttpError } from '@/lib/error';
import { memberRepository } from '@/repositories/member';
import { nodeRepository } from '@/repositories/node';
import { projectRepository } from '@/modules/projects/project.repository';
import { CreateProjectDTO, INode, IProject, ProjectPushNodeDTO } from '@/types';
import { Session } from 'next-auth';

const sortNodes = (nodes: INode[]) => {
  return [...nodes].sort((a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.title!.localeCompare(b.title!, undefined, { sensitivity: 'base' });
  });
};

export const checkExistence = async (data: { userId: string; title: string }) => {
  const projects = await projectRepository.findProjectsByUserId(data.userId);
  const exists = projects.some(
    (proj: IProject) => proj.title?.toLowerCase() === data.title?.toLowerCase()
  );

  if (exists) throw new HttpError(`Project name is ${data.title} already exist.`, 409);

  return;
};

export const projectService = {
  createProject: async (data: CreateProjectDTO) => {
    await checkExistence({
      userId: data.userId!,
      title: data.title || '',
    });
    return projectRepository.create(data);
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
    if (data.title) {
      await checkExistence({
        userId: data.userId!,
        title: data.title || '',
      });
    }
    if (data.archived) return projectRepository.archiveById(id, data);
    return projectRepository.updateProjectById(id, data);
  },

  pullNode: async (dataToFind: { _id: string; userId: string }, data: { nodes: string[] }) => {
    return projectRepository.pullNode(dataToFind, data);
  },
};
