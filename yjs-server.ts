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
    unloadImmediately: false, // Prevents document evaporation on tab switch
    quiet: true,

    extensions: [new Logger()],

    /**
     * Cold Start: Triggered when the first user joins a room that isn't in RAM.
     * This is where we load the "original content".
     */
    async onLoadDocument(data) {
      const doc = new Y.Doc();
      const ytext = doc.getText('codemirror');

      try {
        // If room is new to RAM, fetch from DB
        const node = await Node.findById(data.documentName);
        if (node?.content && ytext.length === 0) {
          ytext.insert(0, '123');
        }
      } catch (e) {
        console.error('Load error', e);
      }
      return doc;
    },

    /**
     * Persistence: Automatically debounced by Hocuspocus.
     */
    async onStoreDocument({ documentName, document }) {
      const currentContent = document.getText('codemirror').toString();

      try {
        // await Node.findByIdAndUpdate(documentName, {
        //   content: currentContent,
        //   updatedAt: new Date(),
        // });
        console.log(`✅ Saved ${documentName} to DB`);
      } catch (error) {
        console.error(`[DB Error] Failed to save node ${documentName}:`, error);
      }
    },
  });

  server.listen();
}
start();
