import { HttpError } from '@/utils/errors';
import { nodeService } from './node.service';
import { NodeDTO } from './node.dto';

export const nodeController = {
  getProjectTree: async (pid: string) => {
    // const session = await ensureAuthenticated();
    if (!pid) throw new HttpError('BAD_INPUT');
    const nodes = await nodeService.getProjectNodeTree(pid);
    return nodes;
  },

  update: async (nid: string, rawBody: { title?: string; content?: string }) => {
    // const session = await ensureAuthenticated();
    if (!nid) throw new HttpError('BAD_INPUT');
    const validatedBody = NodeDTO.update.safeParse(rawBody);
    if (!validatedBody.success) throw new HttpError('BAD_INPUT');

    const updatedNode = await nodeService.update(nid, validatedBody.data);
    return updatedNode;
  },
};
