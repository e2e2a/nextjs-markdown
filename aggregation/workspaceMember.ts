import { PipelineStage } from 'mongoose';

// Owner count lookup and field addition
export const getOwnerCountStages = (populatedWorkspace: boolean): PipelineStage[] => [
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
  { $addFields: { ownerCount: { $size: '$owners' } } },
];

export const getProjectCountStages = (populatedWorkspace: boolean): PipelineStage[] => [
  {
    $lookup: {
      from: 'projects',
      let: { wid: populatedWorkspace ? '$workspaceId._id' : '$workspaceId' },
      pipeline: [{ $match: { $expr: { $eq: ['$workspaceId', '$$wid'] } } }],
      as: 'projects',
    },
  },
  { $addFields: { projectCount: { $size: '$projects' } } },
];
