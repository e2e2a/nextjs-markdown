import { Member } from '@/models/member';
import { InviteMembersDTO, MembersInvited } from '@/types';
const updateOptions = { new: true, runValidators: true };

export const memberRepository = {
  create: (data: InviteMembersDTO, invitedBy: string) => new Member({ ...data, invitedBy }).save(),

  getProjects: (filters: { projectId?: string; email?: string }) =>
    Member.find(filters).lean<MembersInvited[]>().exec(),

  getProject: (filters: { projectId?: string; email?: string }) =>
    Member.findOne(filters).lean<MembersInvited[]>().exec(),

  deleteMany(projectIds: string[]) {
    Member.deleteMany({ projectId: { $in: projectIds } }).exec();
  },
};
