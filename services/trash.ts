import { HttpError } from '@/lib/error';
import { nodeRepository } from '@/repositories/node';
import { projectRepository } from '@/repositories/project';
import { ArchivedItem, INode, IProject } from '@/types';
import { checkExistence, projectService } from './project';
import { BSON } from 'mongodb';
import { checkNodeExistence } from './node';
import { memberRepository } from '@/repositories/member';

function calculateSize(doc: IProject | INode) {
  return BSON.calculateObjectSize(doc);
}

const getNodePath = async (node: INode) => {
  const parts: string[] = [];
  let current: INode | null = node;

  while (current) {
    parts.unshift(current.title as string);
    if (!current.parentId) break;
    current = await nodeRepository.findNode(current.parentId);
  }

  const project = await projectRepository.findProject(node.projectId);
  if (project) parts.unshift(project.title);

  return parts.join('/');
};

export const trashService = {
  async findArchived(userId: string) {
    const [projects, nodes] = await Promise.all([
      await projectRepository.findArchivedProjectsByUserId(userId),
      await nodeRepository.findArchivedNodesByUserId(userId),
    ]);
    const nodeMapped = await Promise.all(
      nodes.map(async n => ({
        _id: n._id,
        title: n.title,
        projectId: n.projectId,
        parentId: n.parentId,
        userId: n.userId,
        path: await getNodePath(n),
        archived: {
          ...n.archived,
          archivedBy: {
            email: n.archived.archivedBy.email,
          },
        },
        type: n.type,
        size: calculateSize(n),
      }))
    );

    return [
      ...projects.map(p => ({
        _id: p._id,
        title: p.title,
        path: p.title + '/',
        userId: p.userId,
        archived: {
          ...p.archived,
          archivedBy: {
            email: p.archived.archivedBy.email,
          },
        },
        type: 'project',
        size: calculateSize(p),
      })),
      ...nodeMapped,
    ];
  },

  async retrieve(userId: string, data: ArchivedItem) {
    if (data.type === 'project') {
      await checkExistence({
        userId: userId,
        title: data.title || '',
      });
      return await projectRepository.retrieveById(data._id);
    }
    if (data.type === 'folder' || data.type === 'file') {
      const project = await projectRepository.findProject(data.projectId || '');
      if (!project) throw new HttpError('The node has no project.', 404);
      if (project.archived?.isArchived)
        throw new HttpError(`Project ${project.title} should be restore.`, 400);
      const node = await nodeRepository.retrieveById(data._id);
      if (!node) throw new HttpError('Node was not found.', 404);
      await checkNodeExistence({
        projectId: data.projectId || '',
        parentId: node.parentId!,
        type: data.type!,
        title: data.title || '',
      });
      return node;
    }
    throw new HttpError('No item to retrieve.', 404);
  },

  async deletePermanently(userId: string, data: ArchivedItem[]) {
    if (data.length === 0) throw new HttpError('No item to delete.', 404);

    const nodeIds = data.filter(n => n.type !== 'project').map(n => n._id);
    if (nodeIds.length > 0) {
      const nodes = data
        .filter(n => n.type !== 'project')
        .map(n => {
          return { _id: n._id, projectId: n.projectId, parentId: n.parentId };
        });

      const nodeProjectIds = Array.from(new Set(data.map(n => n.projectId)));

      await Promise.all(
        nodeProjectIds.map(projectId =>
          projectService.pullNode({ _id: projectId!, userId: userId }, { nodes: nodeIds })
        )
      );

      await Promise.all(
        nodes.map(node =>
          nodeRepository.pullChild(
            { _id: node.parentId!, userId: userId, projectId: node.projectId! },
            [node._id]
          )
        )
      );

      await nodeRepository.deleteMany(userId, nodeIds);
    }
    const projectIds = data.filter(n => n.type === 'project').map(p => p._id);

    if (projectIds.length > 0) {
      await Promise.all(
        projectIds.map(async pId => {
          const project = await projectRepository.findProjectByIdAndUserId({
            _id: pId,
            userId,
          });

          if (!project) return;
          const nodeIds = project.nodes?.map(n => n._id) || [];
          if (nodeIds.length > 0) await nodeRepository.deleteMany(userId, nodeIds);
          await projectRepository.deleteOne(userId, pId);
        })
      );
      await memberRepository.deleteMany(projectIds);
    }
    return;
  },
};
