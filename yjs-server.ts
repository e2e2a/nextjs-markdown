import 'dotenv/config';
import { Server } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import Node from './modules/projects/nodes/node.model';
import * as Y from 'yjs';
import connectDb from './lib/db/connection';

async function start() {
  await connectDb();
  const server = new Server({
    port: 1234,
    unloadImmediately: true, // Prevents document evaporation on tab switch
    quiet: true,

    extensions: [new Logger()],
    async onConnect(data) {
      // Check how many people are in this specific room
      const room = data.instance.documents.get(data.documentName);

      // A room in Hocuspocus has a 'connections' Set
      const userCount = room ? room.connections.size : 0;
      console.log(`Users in ${data.documentName}: ${userCount}`);
    },
    /**
     * Cold Start: Triggered when the first user joins a room that isn't in RAM.
     * This is where we load the "original content".
     */
    async onLoadDocument({ documentName, document }) {
      const ytext = document.getText('codemirror');

      // Check if we already have content in the Yjs Doc (in-memory)
      if (ytext.length > 0) return document;

      try {
        const node = await Node.findById(documentName);
        if (node?.content) {
          // Use a transaction to mark this as the "initial" state
          document.transact(() => {
            ytext.insert(0, node.content);
          }, 'initial-load');
        }
      } catch (e) {
        console.error(e);
      }
      return document;
    },

    /**
     * Persistence: Automatically debounced by Hocuspocus.
     */
    async onStoreDocument({ documentName, document }) {
      const currentContent = document.getText('codemirror').toString();

      try {
        await Node.findByIdAndUpdate(documentName, { content: currentContent }, { new: true });
        console.log(`✅ Saved ${documentName} to DB`);
      } catch (error) {
        console.error(`[DB Error] Failed to save node ${documentName}:`, error);
      }
    },
  });

  server.listen();
}
start();
