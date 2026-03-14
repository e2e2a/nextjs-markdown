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
      const room = data.instance.documents.get(data.documentName);

      const userCount = room ? room.connections.size : 0;
      console.log(`Users in ${data.documentName}: ${userCount}`);
    },
    /**
     * Cold Start: Triggered when the first user joins a room that isn't in RAM.
     * This is where we load the "original content".
     */
    async onLoadDocument({ documentName, document }) {
      if (documentName.startsWith('project-presence-')) return document;

      console.log(`Loaded document "${documentName}"`);

      const ytext = document.getText('codemirror');

      let initialized = false;

      const loadFromDB = async () => {
        if (initialized) return;
        initialized = true;

        const node = await Node.findById(documentName);

        if (node?.content && ytext.length === 0) {
          document.transact(() => {
            ytext.insert(0, node.content);
          }, 'initial-load');

          console.log('DB content inserted');
        }
      };

      const timeout = setTimeout(loadFromDB, 100);

      ytext.observe(() => {
        if (!initialized) {
          initialized = true;
          clearTimeout(timeout);
          console.log('Client state arrived, skipping DB load');
        }
      });

      return document;
    },

    /**
     * Persistence: Automatically debounced by Hocuspocus.
     */
    async onStoreDocument({ documentName, document }) {
      // if document is starting name at project-presence then ignore this
      if (documentName.startsWith('project-presence-')) return;
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
