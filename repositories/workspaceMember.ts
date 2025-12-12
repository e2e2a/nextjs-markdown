import {
  getByEmailAndStatusFinalCleanupStages,
  getOwnerCountStages,
} from '@/aggregation/workspacemember/findByEmailAndStatus';
import {
  getFindMembersInitialMatchStage,
  getFindMembersLookupStages,
} from '@/aggregation/workspacemember/findMembers';
import { addLookup } from '@/lib/helpers/aggregationHelpers';
import WorkspaceMember from '@/models/workspaceMember';
import { PipelineStage } from 'mongoose';

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
    // userId: string;
    status: 'pending' | 'accepted';
    workspaceId: string;
  }) => await new WorkspaceMember(data).save(),

  findOne: async (data: { workspaceId: string; email: string }) =>
    await WorkspaceMember.findOne(data),

  findMembers: async (data: { workspaceId: string; email: string }) => {
    const { workspaceId, email } = data;
    const initialStages = getFindMembersInitialMatchStage(workspaceId, email);
    const lookupAndCleanupStages = getFindMembersLookupStages();
    const pipeline: PipelineStage[] = [...initialStages, ...lookupAndCleanupStages, { $limit: 1 }];

    const result = await WorkspaceMember.aggregate(pipeline);
    return result[0] || null;
  },

  findByEmailAndStatus: async (
    data: { email: string; status: 'pending' | 'accepted' },
    populate: IPopulateWorkspaceMember
  ) => {
    const pipeline: PipelineStage[] = [];
    pipeline.push({ $match: data });
    if (populate.workspaceId) addLookup(pipeline, 'workspaceId', '_id', 'workspaces');
    if (populate.userId) addLookup(pipeline, 'email', 'email', 'users');
    if (populate.invitedBy) addLookup(pipeline, 'invitedBy', 'email', 'users');

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
