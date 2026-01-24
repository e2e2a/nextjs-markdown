import { Server } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';

// ⚠️ Fake DB — replace with real DB later
const FakeDB = {
  async get(documentName: string) {
    console.log(`📥 DB read: ${documentName}`);
    return {
      content: '# Hello from database\n\nThis is initial content.',
    };
  },

  async save(documentName: string, content: string) {
    console.log(`💾 DB save: ${documentName} (${content.length} chars)`);
  },
};

const server = new Server({
  port: 1234,

  // 1. SEEDING (Only for User 1)
  async onLoadDocument({ document, documentName }) {
    const yText = document.getText('codemirror');

    // If yText.length > 0, User 1 already seeded it, and we just
    // give User 2 the current memory state.
    if (yText.length === 0) {
      console.log(`🆕 Doc ${documentName} is fresh. Fetching DB seed...`);
      const node = await FakeDB.get(documentName);
      if (node?.content) {
        document.transact(() => {
          yText.insert(0, node.content);
        });
      }
    } else {
      console.log(`⚡ Doc ${documentName} already in memory. Fast-syncing User...`);
    }
    return document;
  },

  // 2. SAVING (Background task)
  // This saves the collaborative state back to the DB so it's ready for the next cold start.
  async onStoreDocument({ document, documentName }) {
    const content = document.getText('codemirror').toString();
    await FakeDB.save(documentName, content);
    console.log(`💾 Synced memory to DB for ${documentName}`);
  },
});
