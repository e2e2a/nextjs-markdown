import WorkspaceMember from '@/models/workspaceMember';
import { PipelineStage } from 'mongoose';

export interface IPopulateWorkspaceMember {
  userId?: boolean;
  workspaceId?: boolean;
  invitedBy?: boolean;
}

const addLookup = (pipeline: PipelineStage[], localField: string, from: string) => {
  pipeline.push({
    $lookup: {
      from,
      localField,
      foreignField: '_id',
      as: localField,
    },
  });
  pipeline.push({
    $unwind: { path: `$${localField}`, preserveNullAndEmptyArrays: true },
  });
};

export const workspaceMemberRepository = {
  createMany: async (
    members: {
      role: 'owner' | 'member' | 'viewer';
      email: string;
      invitedBy: string;
      status: 'pending' | 'accepted';
      workspaceId: string;
    }[]
  ) => WorkspaceMember.insertMany(members),

  create: async (data: {
    role: 'owner' | 'member' | 'viewer';
    email: string;
    userId: string;
    status: 'pending' | 'accepted';
    workspaceId: string;
  }) => await new WorkspaceMember(data).save(),

  findByEmailAndStatus: async (
    data: { email: string; status: 'pending' | 'accepted' },
    populate: IPopulateWorkspaceMember
  ) => {
    const pipeline: PipelineStage[] = [];
    pipeline.push({ $match: data });
    if (populate.workspaceId) addLookup(pipeline, 'workspaceId', 'workspaces');
    if (populate.userId) addLookup(pipeline, 'userId', 'users');
    if (populate.invitedBy) addLookup(pipeline, 'invitedBy', 'users');

    // Owner count
    if (data.status === 'accepted') {
      pipeline.push({
        $lookup: {
          from: 'workspacemembers',
          let: { wid: '$workspaceId._id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$workspaceId', '$$wid'] } } },
            { $match: { role: 'owner', status: 'accepted' } },
          ],
          as: 'owners',
        },
      });

      pipeline.push({
        $addFields: { ownerCount: { $size: '$owners' } },
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        ...(populate.workspaceId ? { workspaceId: 1 } : {}),
        ...(populate.userId ? { userId: 1 } : {}),
        ...(populate.invitedBy ? { invitedBy: 1 } : {}),
        role: 1,
        status: 1,
        createdAt: 1,
        ...(data.status === 'accepted' ? { ownerCount: 1 } : {}),
      },
    });

    // Manual Remove fields
    pipeline.push({
      $unset: ['invitedBy.password', 'userId.password'],
    });

    return await WorkspaceMember.aggregate(pipeline);
  },

  findExistingEmails: async (workspaceId: string, emails: string[]) => {
    return await WorkspaceMember.find({
      workspaceId,
      email: { $in: emails },
    });
  },

  deleteByWorkspaceIdAndUserId: (data: { workspaceId: string; userId: string }) =>
    WorkspaceMember.findOneAndDelete(data),

  deleteByWorkspaceIdAndEmail: (data: { workspaceId: string; email: string }) =>
    WorkspaceMember.findOneAndDelete(data),

  updateByWorspaceIdAndEmail: (
    data: { email: string; workspaceId: string },
    updateData: { status?: string; role?: string; userId?: string }
  ) => WorkspaceMember.findOneAndUpdate(data, updateData),
};
