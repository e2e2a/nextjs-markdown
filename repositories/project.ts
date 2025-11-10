import Project from '@/models/project';

import { PopulateOptions } from 'mongoose';
import { CreateProjectDTO, IProject, ProjectPushNodeDTO, UpdateProjectDTO } from '@/types';

// recursive populate builder
export function populateChildren(path: string, depth: number = 3): PopulateOptions {
  // stop recursion at depth 0
  if (depth <= 0) return { path };

  return {
    path,
    populate: populateChildren(path, depth - 1),
  };
}

export const projectRepository = {
  findAll: () => Project.find(),

  findProject: (id: string) => Project.findById(id).populate('nodes'),

  findProjectByTitle: (title: string) => Project.findOne({ title }).populate('nodes'),

  findProjectsByUserId: (userId: string) =>
    Project.find({ userId }).populate({
      path: 'nodes',
      match: { parentId: null },
    }),

  create: (data: CreateProjectDTO) => new Project(data).save(),

  pushNode(id: string, data: ProjectPushNodeDTO): Promise<IProject | null> {
    return Project.findByIdAndUpdate(
      id,
      { ...(data.nodes ? { $push: { nodes: { $each: data.nodes } } } : {}) },
      { new: true, runValidators: true }
    )
      .lean<IProject>()
      .exec();
  },

  updateProjectById: (id: string, data: UpdateProjectDTO) => {
    return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .lean<IProject>()
      .exec();
  },

  archiveById(nodeId: string, data: Partial<IProject>): Promise<IProject | null> {
    return Project.findByIdAndUpdate(
      nodeId,
      {
        $set: { archived: data.archived },
      },
      { new: true }
    )
      .lean<IProject>()
      .exec();
  },
};
