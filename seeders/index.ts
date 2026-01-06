import mongoose from 'mongoose';
import Node from '@/modules/projects/nodes/node.model';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';

const rootFolders = [
  {
    workspaceId: '693ac82516a8418a9bc8df99',
    projectId: '69540959741645fa714e04d2',
    title: 'n1',
    type: 'folder',
    parentId: null,
    content: '',
  },
  {
    workspaceId: '693ac82516a8418a9bc8df99',
    projectId: '69540959741645fa714e04d2',
    title: 'n2',
    type: 'folder',
    parentId: null,
    content: '',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');

    await Node.deleteMany({});
    console.log('Existing nodes removed');

    const roots = await Node.insertMany(rootFolders);

    for (const root of roots) {
      const rootFiles = await Node.insertMany([
        {
          workspaceId: root.workspaceId,
          projectId: root.projectId,
          parentId: root._id,
          title: `${root.title}-file-1`,
          type: 'file',
          content: 'Root file 1',
        },
        {
          workspaceId: root.workspaceId,
          projectId: root.projectId,
          parentId: root._id,
          title: `${root.title}-file-2`,
          type: 'file',
          content: 'Root file 2',
        },
      ]);

      const subFolder = await Node.create({
        workspaceId: root.workspaceId,
        projectId: root.projectId,
        parentId: root._id,
        title: `${root.title}-subfolder`,
        type: 'folder',
        content: '',
      });

      const subFiles = await Node.insertMany([
        {
          workspaceId: root.workspaceId,
          projectId: root.projectId,
          parentId: subFolder._id,
          title: `${root.title}-subfile-1`,
          type: 'file',
          content: 'Sub file 1',
        },
        {
          workspaceId: root.workspaceId,
          projectId: root.projectId,
          parentId: subFolder._id,
          title: `${root.title}-subfile-2`,
          type: 'file',
          content: 'Sub file 2',
        },
      ]);

      subFolder.children = subFiles.map(f => f._id);
      await subFolder.save();

      root.children = [...rootFiles.map(f => f._id), subFolder._id];
      await root.save();
    }

    console.log('Seeded successfully');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding failed:', err);
    await mongoose.disconnect();
  }
}

seed();
