import { HttpError } from '@/lib/error';
import { generateInviteToken } from '@/lib/jwt';
import { memberRepository } from '@/repositories/member';
import { InviteMembersDTO, MembersInvited } from '@/types';
import { Session } from 'next-auth';
import mongoose from 'mongoose';
import { projectRepository } from '@/repositories/project';

export const memberService = {
  create: async (session: Session, data: InviteMembersDTO) => {
    if (session.user.email === data.email)
      throw new HttpError('Cannot invite your own gmail.', 403);
    const memberExist = await memberRepository.getProject({
      projectId: data.projectId,
      email: data.email,
    });
    if (memberExist) throw new HttpError('Member is already invited.', 409);
    const member = await memberRepository.create(data, session.user._id as string);
    if (!member) throw new HttpError('Seomthing went wrong', 500);
    const token = generateInviteToken(member._id as string);
    if (!token) throw new HttpError('Seomthing went wrong', 500);
    member.token = token;
    await member.save();
    return member;
  },

  findMembers: async (session: Session, filters: { projectId: string }) => {
    let members: MembersInvited[];
    switch (true) {
      case !!filters.projectId && mongoose.Types.ObjectId.isValid(filters.projectId):
        const project = await projectRepository.findProject(filters.projectId);
        if (!project) throw new HttpError('Project not found.', 404);
        if (project.userId.toString() !== session.user._id) throw new HttpError('Forbidden.', 403);
        members = await memberRepository.getProjects(filters);
        break;
      default:
        members = [];
        break;
    }
    return members;
  },
};
