import { HttpError } from '@/utils/errors';
import { nodeService } from './node.service';

export const nodeController = {
  getProjectTree: async (pid: string) => {
    // const session = await ensureAuthenticated();
    if (!pid) throw new HttpError('BAD_INPUT');
    const nodes = await nodeService.getProjectNodeTree(pid);
    return nodes;
  },
};
