import { Server } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import Node from './modules/projects/nodes/node.model';

const server = new Server({
  port: 1234,
  unloadImmediately: false, // Prevents document evaporation on tab switch

  extensions: [new Logger()],

  /**
   * Cold Start: Triggered when the first user joins a room that isn't in RAM.
   */
  async onLoadDocument({ documentName, document }) {
    const ytext = document.getText('codemirror');

    // If the doc is already in server RAM, return it immediately.
    if (ytext.length > 0) return document;

    try {
      // documentName is the nodeId passed from the client
      const node = await Node.findById(documentName);

      if (node?.content) {
        document.transact(() => {
          // 'initial-load' origin prevents unnecessary triggers elsewhere
          ytext.insert(0, node.content);
        }, 'initial-load');
      }
    } catch (error) {
      console.error(`[DB Error] Failed to load node ${documentName}:`, error);
    }

    return document;
  },

  /**
   * Persistence: Automatically debounced by Hocuspocus.
   */
  async onStoreDocument({ documentName, document }) {
    const currentContent = document.getText('codemirror').toString();

    try {
      await Node.findByIdAndUpdate(documentName, {
        content: currentContent,
        updatedAt: new Date(),
      });
      console.log(`✅ Saved ${documentName} to DB`);
    } catch (error) {
      console.error(`[DB Error] Failed to save node ${documentName}:`, error);
    }
  },
});

server.listen();
