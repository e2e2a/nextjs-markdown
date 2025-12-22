import {
  getByEmailAndStatusFinalCleanupStages,
  getOwnerCountStages,
} from '@/aggregation/workspacemember/findByEmailAndStatus';
import { addLookup } from '@/lib/helpers/aggregationHelpers';
import WorkspaceMember from '@/models/workspaceMember';
import { PipelineStage } from 'mongoose';
import mongoose from 'mongoose';

export interface IPopulateWorkspaceMember {
  userId?: boolean;
  workspaceId?: boolean;
  invitedBy?: boolean;
}

export const workspaceMemberRepository = {
  createMany: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      invitedBy: string;
      workspaceId: string;
    }[]
  ) => WorkspaceMember.insertMany(members),

  create: async (data: {
    role: 'owner' | 'editor' | 'viewer';
    email: string;
    status: 'pending' | 'accepted';
    workspaceId: string;
  }) => await new WorkspaceMember(data).save(),

  findOne: async (data: { workspaceId: string; email: string }) => {
    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $match: {
        workspaceId: new mongoose.Types.ObjectId(data.workspaceId),
        email: data.email,
      },
    });
    addLookup(pipeline, 'email', 'email', 'users', false);
    pipeline.push({ $limit: 1 });

    const [result] = await WorkspaceMember.aggregate(pipeline);
    return result ?? null;
  },

  findMembers: async (data: { workspaceId: string; email: string }) => {
    const pipeline: PipelineStage[] = [];
    pipeline.push({ $match: { workspaceId: new mongoose.Types.ObjectId(data.workspaceId) } });
    addLookup(pipeline, 'email', 'email', 'users', false);
    pipeline.push({
      $lookup: {
        from: 'projectmembers',
        let: {
          memberEmail: '$email.email',
          workspaceId: '$workspaceId',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$email', '$$memberEmail'] },
                  { $eq: ['$workspaceId', '$$workspaceId'] },
                ],
              },
            },
          },
        ],
        as: 'projects',
      },
    });
    pipeline.push({
      $project: {
        workspaceId: 1,
        role: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        projects: { $size: '$projects' },
        user: {
          _id: '$email._id',
          family_name: '$email.family_name',
          given_name: '$email.given_name',
          email: '$email.email',
          last_login: '$email.last_login',
        },
      },
    });
    const result = await WorkspaceMember.aggregate(pipeline);
    return result || [];
  },

  findByEmailAndStatus: async (
    data: { email: string; status: 'pending' | 'accepted' },
    populate: IPopulateWorkspaceMember
  ) => {
    const pipeline: PipelineStage[] = [];
    pipeline.push({ $match: data });
    if (populate.workspaceId) addLookup(pipeline, 'workspaceId', '_id', 'workspaces', false);
    if (populate.userId) addLookup(pipeline, 'email', 'email', 'users', false);
    if (populate.invitedBy) addLookup(pipeline, 'invitedBy', 'email', 'users', false);

    pipeline.push(...getOwnerCountStages());

    pipeline.push({
      $project: {
        _id: 1,
        ...(populate.workspaceId ? { workspaceId: 1 } : {}),
        ...(populate.userId ? { userId: 1 } : {}),
        ...(populate.invitedBy ? { invitedBy: 1 } : {}),
        role: 1,
        status: 1,
        createdAt: 1,
        ownerCount: 1,
      },
    });

    pipeline.push(...getByEmailAndStatusFinalCleanupStages());
    return await WorkspaceMember.aggregate(pipeline);
  },

  findExistingEmails: async (workspaceId: string, emails: string[]) => {
    return await WorkspaceMember.find({
      workspaceId,
      email: { $in: emails },
    })
      .lean()
      .then(docs => docs.map(doc => doc.email));
  },

  deleteByWorkspaceIdAndUserId: (data: { workspaceId: string; userId: string }) =>
    WorkspaceMember.findOneAndDelete(data),

  deleteByIdAndEmail: (data: { _id: string; email: string }) =>
    WorkspaceMember.findOneAndDelete(data),

  updateByIdAndEmail: (
    data: { email: string; _id: string },
    updateData: { status?: string; role?: string }
  ) => WorkspaceMember.findOneAndUpdate(data, updateData),
};
