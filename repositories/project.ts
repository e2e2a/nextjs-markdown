import Project from '@/models/project';
import { PopulateOptions } from 'mongoose';
import { CreateProjectDTO, IProject, ProjectPushNodeDTO, UpdateProjectDTO } from '@/types';

const updateOptions = { new: true, runValidators: true };

export function populateChildren(path: string, depth: number = 3): PopulateOptions {
  if (depth <= 0) return { path };

  return {
    path,
    populate: populateChildren(path, depth - 1),
  };
}

export const projectRepository = {
  findAll: () => Project.find(),

  findProject: (id: string) => Project.findById(id).populate('nodes'),

  findProjectByIdAndUserId: (data: { _id: string; userId: string }) =>
    Project.findOne(data).populate('nodes').lean<IProject>(),

  findProjectByTitle: (title: string) => Project.findOne({ title }).populate('nodes'),

  findProjectsByUserId: (userId: string) =>
    Project.find({ userId, 'archived.isArchived': false }).populate({
      path: 'nodes',
      match: { parentId: null },
    }),

  create: (data: CreateProjectDTO) => new Project(data).save(),

  pushNode(id: string, data: ProjectPushNodeDTO): Promise<IProject | null> {
    return Project.findByIdAndUpdate(
      id,
      { ...(data.nodes ? { $push: { nodes: { $each: data.nodes } } } : {}) },
      updateOptions
    )
      .lean<IProject>()
      .exec();
  },

  pullNode(
    dataToFind: { _id: string; userId: string },
    data: { nodes: string[] }
  ): Promise<IProject | null> {
    return Project.findOneAndUpdate(
      dataToFind,
      { ...(data.nodes ? { $pull: { nodes: { $in: data.nodes } } } : {}) },
      updateOptions
    )
      .lean<IProject>()
      .exec();
  },

  updateProjectById: (id: string, data: UpdateProjectDTO) => {
    return Project.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .lean<IProject>()
      .exec();
  },

  archiveById(projectId: string, data: Partial<IProject>): Promise<IProject | null> {
    return Project.findByIdAndUpdate(
      projectId,
      {
        $set: { archived: data.archived },
      },
      updateOptions
    )
      .lean<IProject>()
      .exec();
  },

  retrieveById(projectId: string): Promise<IProject | null> {
    return Project.findByIdAndUpdate(
      projectId,
      {
        $set: { archived: { isArchived: false, archivedAt: null, archivedBy: null } },
      },
      updateOptions
    )
      .lean<IProject>()
      .exec();
  },

  deleteOne(userId: string, _id: string) {
    Project.deleteOne({ userId, _id }).exec();
  },

  findArchivedProjectsByUserId(userId: string) {
    return Project.find({ userId, 'archived.isArchived': true })
      .populate('archived.archivedBy')
      .exec();
  },
};
