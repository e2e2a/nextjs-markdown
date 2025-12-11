import { PipelineStage, Types } from 'mongoose';

// A constant array for the initial match stage
export const getFindMembersInitialMatchStage = (
  workspaceId: string,
  email: string
): PipelineStage[] => [
  // 1) Match membership
  {
    $match: {
      workspaceId: new Types.ObjectId(workspaceId),
      email,
      status: 'accepted',
    },
  },
];

// The core lookup and cleanup stages
export const getFindMembersLookupStages = (): PipelineStage[] => [
  // 2) Join Workspace
  {
    $lookup: {
      from: 'workspaces',
      localField: 'workspaceId',
      foreignField: '_id',
      as: 'workspaceId',
    },
  },
  { $unwind: '$workspaceId' },
  // Lookup all accepted members for the given workspace
  {
    $lookup: {
      from: 'workspacemembers',
      let: { wid: '$workspaceId._id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$workspaceId', '$$wid'] } } },
        { $match: { status: 'accepted' } },
      ],
      as: 'members',
    },
  },
  // Cleanup sensitive fields
  {
    $unset: ['invitedBy.password', 'userId.password'],
  },
];
