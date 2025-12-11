import { PipelineStage, Types } from 'mongoose';

// Pipeline to lookup project members and count them.
const getProjectCountLookupPipeline = (): PipelineStage[] => [
  {
    $match: {
      $expr: {
        $and: [{ $eq: ['$projectId', '$$pid'] }, { $eq: ['$workspaceId', '$$wid'] }],
      },
    },
  },
  { $count: 'memberCount' },
];

// Pipeline to populate the Project document and include the member count.
const getPopulateProjectWithCountPipeline = (): PipelineStage[] => [
  { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
  // Lookup project members to count users
  {
    $lookup: {
      from: 'projectmembers',
      let: { pid: '$_id', wid: '$workspaceId' },
      pipeline: getProjectCountLookupPipeline() as PipelineStage.Lookup[],
      as: 'memberCountArray',
    },
  },
  // Add memberCount field (default to 0 if no members)
  {
    $addFields: {
      memberCount: {
        $ifNull: [{ $arrayElemAt: ['$memberCountArray.memberCount', 0] }, 0],
      },
    },
  },
  // Cleanup
  { $project: { memberCountArray: 0 } },
];

// --- Main Pipeline Sections ---

// 1) Initial Match, Field setup, and Workspace Lookup
export const getInitialStages = (workspaceId: Types.ObjectId, email: string): PipelineStage[] => [
  {
    // 1) Match membership
    $match: {
      workspaceId: workspaceId,
      email,
      status: 'accepted',
    },
  },
  // 2) Keep raw workspaceId for lookups
  { $addFields: { workspaceIdRaw: '$workspaceId' } },
  // 3) Populate workspace
  {
    $lookup: {
      from: 'workspaces',
      localField: 'workspaceId',
      foreignField: '_id',
      as: 'workspaceId',
    },
  },
  { $unwind: '$workspaceId' },
];

// 4) Load project memberships (for members)
export const getMemberProjectsLookupStage = (): PipelineStage => ({
  $lookup: {
    from: 'projectmembers',
    let: { wid: '$workspaceIdRaw', uemail: '$email' },
    pipeline: [
      // Filter projectmembers by email/workspace
      {
        $match: {
          $expr: {
            $and: [{ $eq: ['$workspaceId', '$$wid'] }, { $eq: ['$email', '$$uemail'] }],
          },
        },
      },
      // populate project directly (using the combined pipeline)
      {
        $lookup: {
          from: 'projects',
          let: { pid: '$projectId', wid: '$workspaceId' },
          pipeline: getPopulateProjectWithCountPipeline() as PipelineStage.Lookup[],
          as: 'project',
        },
      },
      { $unwind: '$project' },
      { $project: { project: 1 } },
    ],
    as: 'memberProjects',
  },
});

// 5) Load all workspace projects (for owner)
export const getOwnerProjectsLookupStage = (): PipelineStage => ({
  $lookup: {
    from: 'projects',
    let: { wid: '$workspaceId._id' },
    pipeline: [
      // 1) Only projects in this workspace
      { $match: { $expr: { $eq: ['$workspaceId', '$$wid'] } } },
      // 2) Lookup projectMembers to count users
      {
        $lookup: {
          from: 'projectmembers',
          let: { pid: '$_id', wid: '$workspaceId' },
          pipeline: getProjectCountLookupPipeline() as PipelineStage.Lookup[],
          as: 'memberCountArray',
        },
      },
      // 3) Add memberCount field
      {
        $addFields: {
          memberCount: {
            $ifNull: [{ $arrayElemAt: ['$memberCountArray.memberCount', 0] }, 0],
          },
        },
      },
      // 4) Cleanup
      { $project: { memberCountArray: 0 } },
    ],
    as: 'ownerProjects',
  },
});

// 6) & 7) Final Projection and Cleanup
export const getOneMembershipFinalCleanupStages = (): PipelineStage[] => [
  // 6) Conditionally pick projects based on role
  {
    $project: {
      _id: 1,
      workspaceId: 1,
      invitedBy: 1,
      email: 1,
      role: 1,
      // The logic remains identical to ensure the return type is unchanged
      projects: {
        $cond: [{ $eq: ['$role', 'owner'] }, '$ownerProjects', '$memberProjects.project'],
      },
    },
  },
  // 7) Cleanup sensitive fields
  {
    $unset: ['invitedBy.password', 'userId.password', 'ownerProjects'],
  },
];
