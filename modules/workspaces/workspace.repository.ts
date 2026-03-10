import { UnitOfWork } from '@/common/UnitOfWork';
import Workspace from '@/modules/workspaces/workspace.model';

export const workspaceRepository = {
  store: async (data: { ownerUserId: string; title: string }) => {
    const session = UnitOfWork.getSession();
    const workspace = new Workspace(data);
    await workspace.save({ session });
    return workspace;
  },
};
