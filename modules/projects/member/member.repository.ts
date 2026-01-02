import ProjectMember from '@/modules/projects/member/member.model';
import mongoose from 'mongoose';

export const projectMemberRepository = {
  create: async (data: {
    role: 'owner' | 'editor' | 'viewer';
    email: string;
    workspaceId: string;
    projectId: string;
  }) => await new ProjectMember(data).save(),

  createMany: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      workspaceId: string;
      projectId: string;
    }[]
  ) => ProjectMember.insertMany(members),

  findExistingEmails: async (workspaceId: string, projectId: string, emails: string[]) => {
    return await ProjectMember.find({
      workspaceId,
      projectId,
      email: { $in: emails },
    })
      .lean()
      .then(docs => docs.map(doc => doc.email));
  },

  findProjects: async (data: { workspaceId?: string; email: string }) => {
    const { workspaceId, email } = data;
    return ProjectMember.aggregate([
      {
        $match: {
          ...(workspaceId ? { workspaceId: new mongoose.Types.ObjectId(workspaceId) } : {}),
          email,
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $lookup: {
          from: 'projectmembers',
          let: { pid: '$projectId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$projectId', '$$pid'] } } },
            { $count: 'memberCount' },
          ],
          as: 'memberData',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$project',
              {
                role: '$role',
                memberCount: { $ifNull: [{ $first: '$memberData.memberCount' }, 0] },
              },
            ],
          },
        },
      },
    ]);
  },

  findOne: async (data: { projectId: string; email: string }) => await ProjectMember.findOne(data),
};
