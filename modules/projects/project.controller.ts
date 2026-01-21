import { ensureAuthenticated } from '@/lib/auth-utils';
import { projectService } from './project.service';
import { NextRequest } from 'next/server';
import { MembersSchema } from '@/lib/validators/workspaceMember';
import { projectSchema } from '@/lib/validators/project';
import { HttpError } from '@/utils/server/errors';

export const projectController = {
  create: async (req: NextRequest) => {
    const body = await req.json();
    const session = await ensureAuthenticated();
    const { workspaceId, title, members } = body;
    const resP = projectSchema.safeParse({ title });
    if (!resP.success) throw new HttpError('BAD_INPUT', 'Invalid fields.');

    let resM = null;
    if (members && members.length > 0) {
      resM = MembersSchema.safeParse(members);
      if (!resM.success) throw new HttpError('BAD_INPUT', 'Invalid member fields.');
    }

    const { project } = await projectService.create(session.user, {
      ...(resM && resM?.data.length > 0 ? { members: resM.data } : {}),
      workspaceId,
      title: resP.data.title,
    });

    return { project };
  },

  update: async (req: NextRequest, pid: string) => {
    const body = await req.json();
    const session = await ensureAuthenticated();
    const res = projectSchema.safeParse({ title: body.title });
    if (!res.success) throw new HttpError('BAD_INPUT', 'Invalid fields.');

    await projectService.update(pid, session.user.email, { ...res.data });
    return null;
  },

  move: async (req: NextRequest, pid: string | null) => {
    const body = await req.json();
    const session = await ensureAuthenticated();
    if (!pid) throw new HttpError('BAD_INPUT', 'Invalid fields.');

    await projectService.move(pid, session.user.email, { workspaceId: body.workspaceId });

    return null;
  },

  getProjects: async (wid: string | null) => {
    const session = await ensureAuthenticated();
    let projects = [];
    switch (true) {
      case !!wid:
        projects = await projectService.getMyWorkspaceProjects(wid, session.user.email);
        break;
      default:
        projects = await projectService.getAllProjects(session.user.email);
        break;
    }
    return projects;
  },

  getProject: async (pid: string | null) => {
    const session = await ensureAuthenticated();
    if (!pid) throw new HttpError('BAD_INPUT');
    const project = await projectService.findProject(session.user.email, pid);
    return project;
  },
};
