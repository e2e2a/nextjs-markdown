import { UnitOfWork } from '@/common/UnitOfWork';
import ProjectMember from '@/modules/projects/member/member.model';
import mongoose from 'mongoose';
const updateOptions = { new: true, runValidators: true };

export const projectMemberRepository = {
  create: async (data: {
    role: 'owner' | 'editor' | 'viewer';
    email: string;
    workspaceId: string;
    projectId: string;
  }) => {
    const session = UnitOfWork.getSession();
    // Note: Mongoose .create() expects an array when options (like session) are used
    // This returns an array of created documents
    const [newMember] = await ProjectMember.create([data], { ...updateOptions, session });
    return newMember;
  },

  createMany: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      workspaceId: string;
      projectId: string;
    }[]
  ) => {
    const session = UnitOfWork.getSession();
    return await ProjectMember.insertMany(members, { ...updateOptions, session });
  },

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
  findMany: async (data: { projectId: string; workspaceId: string }) =>
    await ProjectMember.find(data),

  updateMany: async (
    dataToFind: { workspaceId: string; projectId: string },
    updateData: { workspaceId: string; role: 'owner' | 'editor' | 'viewer' }
  ) => {
    const session = UnitOfWork.getSession();
    return await ProjectMember.updateMany(
      dataToFind,
      { $set: updateData },
      { ...updateOptions, session }
    );
  },
};
