import ProjectMember from '@/models/projectMember';

export const projectMemberRepository = {
  create: async (data: {
    role: 'owner' | 'editor' | 'viewer';
    userId: string;
    workspaceId: string;
    projectId: string;
  }) => await new ProjectMember(data).save(),

  createMany: async (
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
      workspaceId: string;
      projectId: string;
    }[]
  ) => ProjectMember.insertMany(members),

  findExistingEmails: async (workspaceId: string, projectId: string, emails: string[]) => {
    return await ProjectMember.find({
      workspaceId,
      projectId,
      email: { $in: emails },
    })
      .lean()
      .then(docs => docs.map(doc => doc.email));
  },
};
