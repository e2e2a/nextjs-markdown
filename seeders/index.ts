import mongoose from 'mongoose';
import Node from '@/modules/projects/nodes/node.model';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';

const BASE = {
  workspaceId: '693ac82516a8418a9bc8df99',
  projectId: '69540959741645fa714e04d2',
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🚀 Connected to MongoDB');

    // 1. Clear existing nodes to start fresh
    await Node.deleteMany({ projectId: BASE.projectId });
    console.log('🧹 Cleaned existing project nodes');

    // 2. Create 5 Main Parent Trees
    for (let i = 1; i <= 5; i++) {
      console.log(`Building Tree #${i}...`);

      // Create Top Level Parent
      let currentParent = await Node.create({
        ...BASE,
        parentId: null,
        title: `Root-Parent-${i}`,
        type: 'folder',
      });

      // 3. Create 4 levels of nested sub-parents (Total depth: 5 folders)
      for (let depth = 1; depth <= 4; depth++) {
        const subParent = await Node.create({
          ...BASE,
          parentId: currentParent._id,
          title: `Sub-Level-${depth}-of-Tree-${i}`,
          type: 'folder',
        });

        // Update the currentParent's children array to include this new sub-folder
        await Node.findByIdAndUpdate(currentParent._id, {
          $push: { children: subParent._id },
        });

        // Move the pointer deeper: the new subParent becomes the parent for the next loop
        currentParent = subParent;
      }

      // 4. Create 5 terminal "Child" files at the very bottom of this deep chain
      const leafFiles = [];
      for (let f = 1; f <= 5; f++) {
        const file = await Node.create({
          ...BASE,
          parentId: currentParent._id,
          title: `leaf-file-${f}.ts`,
          type: 'file',
          content: `// This is file ${f} inside the deep nested structure of tree ${i}`,
        });
        leafFiles.push(file._id);
      }

      // Final update to the deepest folder to include its files
      await Node.findByIdAndUpdate(currentParent._id, {
        $push: { children: { $each: leafFiles } },
      });
    }

    console.log('✅ Success: 5 deep-nested trees created (5 levels deep each)');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
