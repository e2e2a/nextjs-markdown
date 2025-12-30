import { PipelineStage } from 'mongoose';

// Owner count lookup and field addition
export const getOwnerCountStages = (populatedWorkspace: boolean): PipelineStage[] => [
  // Owner count lookup
  {
    $lookup: {
      from: 'workspacemembers',
      let: { wid: populatedWorkspace ? '$workspaceId._id' : '$workspaceId' },
      pipeline: [
        { $match: { $expr: { $eq: ['$workspaceId', '$$wid'] } } },
        { $match: { role: 'owner', status: 'accepted' } },
      ],
      as: 'owners',
    },
  },
  // Add ownerCount field
  {
    $addFields: { ownerCount: { $size: '$owners' } },
  },
];

// Final Cleanup stages
export const getByEmailAndStatusFinalCleanupStages = (): PipelineStage[] => [
  // Manual Remove sensitive fields
  {
    // $unset the sensitive fields and the temporary 'owners' array
    $unset: ['invitedBy.password', 'userId.password', 'owners'],
  },
];
