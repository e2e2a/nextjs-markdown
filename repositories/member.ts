import { Member } from '@/models/member';
import { InviteMembersDTO, MembersInvited } from '@/types';
const updateOptions = { new: true, runValidators: true };

interface IProps {
  projectId?: string;
  email?: string;
  invitedBy?: string;
  status?: string;
}

export const memberRepository = {
  create: (data: InviteMembersDTO, invitedBy: string) => new Member({ ...data, invitedBy }).save(),

  getMembers: (filters: Partial<IProps>) =>
    Member.find(filters)
      .populate('invitedBy')
      .populate('projectId')
      .lean<MembersInvited[]>()
      .exec(),

  getMember: (filters: Partial<IProps>) => Member.findOne(filters).lean<MembersInvited[]>().exec(),

  deleteMany(projectIds: string[]) {
    Member.deleteMany({ projectId: { $in: projectIds } }).exec();
  },

  updateStatus: (id: string, status: 'pending' | 'accepted' | 'rejected' | 'leave') =>
    Member.findByIdAndUpdate(id, { $set: { status } }, updateOptions).lean<MembersInvited>().exec(),

  deleteMember: (_id: string, invitedBy: string) =>
    Member.findOneAndDelete({ _id, invitedBy }, updateOptions).lean<MembersInvited>().exec(),
};
