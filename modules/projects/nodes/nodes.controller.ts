import { HttpError } from '@/utils/errors';
import { nodeService } from './node.service';
import { NodeDTO } from './node.dto';
import { ensureAuthenticated } from '@/lib/auth-utils';

export const nodeController = {
  getProjectTree: async (pid: string) => {
    // const session = await ensureAuthenticated();
    if (!pid) throw new HttpError('BAD_INPUT');
    const nodes = await nodeService.getProjectNodeTree(pid);
    return nodes;
  },

  update: async (nid: string, rawBody: { title?: string; content?: string }) => {
    const session = await ensureAuthenticated();
    if (!nid) throw new HttpError('BAD_INPUT');
    const validatedBody = NodeDTO.update.safeParse(rawBody);

    if (!validatedBody.success) {
      const errorMessage = validatedBody.error.issues[0].message;
      throw new HttpError('BAD_INPUT', errorMessage);
    }

    const updatedNode = await nodeService.update(nid, validatedBody.data);
    return updatedNode;
  },

  create: async (rawBody: { title?: string; content?: string }) => {
    const session = await ensureAuthenticated();
    const validatedBody = NodeDTO.create.safeParse(rawBody);
    if (!validatedBody.success) {
      const errorMessage = validatedBody.error.issues[0].message;
      throw new HttpError('BAD_INPUT', errorMessage);
    }

    const node = await nodeService.create(session.user.email, validatedBody.data);
    return node;
  },
};
