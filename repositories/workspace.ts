import Workspace from '@/models/workspace';
import { IWorkspace } from '@/types';

export const workspaceRepository = {
  findWorkspace: (id: string) => Workspace.findById(id).lean<IWorkspace | null>().exec(),

  create: (data: IWorkspace) => new Workspace(data).save(),
};
