import { getOwnerCountStages, getProjectCountStages } from '@/aggregation/workspaceMember';
import { addLookup } from '@/lib/helpers/aggregationHelpers';
import WorkspaceMember from '@/modules/workspaces/members/member.model';
import { PipelineStage } from 'mongoose';
import mongoose from 'mongoose';

export interface IPopulateWorkspaceMember {
  invitedBy?: boolean;
}

export const workspaceMemberRepository = {
  createMany: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      invitedBy: string;
      workspaceId: string;
      status: 'pending' | 'accepted';
    }[]
  ) => WorkspaceMember.insertMany(members),

  create: async (data: {
    role: 'owner' | 'editor' | 'viewer';
    email: string;
    status: 'pending' | 'accepted';
    workspaceId: string;
  }) => await new WorkspaceMember(data).save(),

  findById: (_id: string) => WorkspaceMember.findOne({ _id }),

  getMembershipForWorkspace: async (data: { workspaceId: string; email: string }) => {
    const pipeline: PipelineStage[] = [];
    pipeline.push({
      $match: {
        workspaceId: new mongoose.Types.ObjectId(data.workspaceId),
        email: data.email,
      },
    });
    addLookup(pipeline, 'email', 'email', 'users', false);
    pipeline.push({ $limit: 1 });

    pipeline.push({
      $addFields: {
        user: {
          _id: '$email._id',
          email: '$email.email',
          role: '$email.role',
        },
      },
    });
    pipeline.push(...getOwnerCountStages(false));
    pipeline.push({
      $project: {
        email: 0,
      },
    });
    const [result] = await WorkspaceMember.aggregate(pipeline);
    return result ?? null;
  },

  findMembers: async (data: { workspaceId: string; emails?: string[] }) => {
    const pipeline: PipelineStage[] = [];
    pipeline.push({
      $match: {
        workspaceId: new mongoose.Types.ObjectId(data.workspaceId),
        ...(data.emails && data.emails.length > 0 ? { email: { $in: data.emails } } : {}),
      },
    });
    pipeline.push({ $addFields: { originalEmail: '$email' } });
    addLookup(pipeline, 'email', 'email', 'users', false);

    pipeline.push({
      $lookup: {
        from: 'projectmembers',
        let: { memberEmail: '$originalEmail', workspaceId: '$workspaceId' },
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
      $addFields: {
        email: '$originalEmail',
        projects: { $size: '$projects' },
        user: {
          $cond: [
            { $ifNull: ['$email._id', false] },
            {
              _id: '$email._id',
              family_name: '$email.family_name',
              given_name: '$email.given_name',
              email: '$email.email',
              last_login: '$email.last_login',
            },
            null,
          ],
        },
      },
    });
    pipeline.push({ $project: { originalEmail: 0, 'email.password': 0 } });

    const result = await WorkspaceMember.aggregate(pipeline);
    return result ?? [];
  },

  findByEmailAndStatus: async (
    data: { email: string; status: 'pending' | 'accepted' },
    populate?: IPopulateWorkspaceMember
  ) => {
    const pipeline: PipelineStage[] = [];
    pipeline.push({ $match: data });
    addLookup(pipeline, 'workspaceId', '_id', 'workspaces', false);
    if (populate && populate.invitedBy) addLookup(pipeline, 'invitedBy', 'email', 'users', false);

    pipeline.push(...getOwnerCountStages(true));
    pipeline.push(...getProjectCountStages(true));
    const result = await WorkspaceMember.aggregate(pipeline);
    return result || [];
  },

  findExistingEmails: async (workspaceId: string, emails: string[]) => {
    return await WorkspaceMember.find({
      workspaceId,
      email: { $in: emails },
    })
      .lean()
      .then(docs => docs.map(doc => doc.email));
  },

  deleteByWorkspaceIdAndEmail: (data: { workspaceId: string; email: string }) =>
    WorkspaceMember.findOneAndDelete(data),

  deleteById: (_id: string) => WorkspaceMember.findOneAndDelete({ _id }),

  updateStatus: (data: { email: string; _id: string }, updateData: { status: string }) =>
    WorkspaceMember.findOneAndUpdate(data, updateData),

  updateById: (_id: string, updateData: { role?: string }) =>
    WorkspaceMember.findOneAndUpdate({ _id }, updateData),
};
