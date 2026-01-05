import Workspace from '@/modules/workspaces/workspace.model';
import { IWorkspace } from '@/types';

export const workspaceRepository = {
  findWorkspaceId: (id: string) => Workspace.findById(id).lean<IWorkspace | null>().exec(),

  store: async (data: { ownerUserId: string; title: string }) => {
    const workspace = await new Workspace(data).save();
    return workspace;
  },
};
