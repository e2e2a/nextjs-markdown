import {
  getByEmailAndStatusFinalCleanupStages,
  getOwnerCountStages,
} from '@/aggregation/workspacemember/findByEmailAndStatus';
import {
  getFindMembersInitialMatchStage,
  getFindMembersLookupStages,
} from '@/aggregation/workspacemember/findMembers';
import {
  getOneMembershipFinalCleanupStages,
  getInitialStages,
  getMemberProjectsLookupStage,
  getOwnerProjectsLookupStage,
} from '@/aggregation/workspacemember/findOneMembership';
import { addLookup } from '@/lib/helpers/aggregationHelpers';
import WorkspaceMember from '@/models/workspaceMember';
import { PipelineStage, Types } from 'mongoose';

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

  findOneMembership: async (data: { workspaceId: string; email: string }) => {
    const { workspaceId, email } = data;
    const workspaceObjectId = new Types.ObjectId(workspaceId);

    const initialStages = getInitialStages(workspaceObjectId, email);
    const projectLookups = [
      getMemberProjectsLookupStage(), // For members
      getOwnerProjectsLookupStage(), // For owners
    ];

    // Final Projection and Cleanup
    const finalStages = getOneMembershipFinalCleanupStages();

    // Assemble the complete pipeline
    const pipeline: PipelineStage[] = [
      ...initialStages,
      ...projectLookups,
      ...finalStages,
      { $limit: 1 },
    ];

    const result = await WorkspaceMember.aggregate(pipeline);
    return result[0] || null;
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
