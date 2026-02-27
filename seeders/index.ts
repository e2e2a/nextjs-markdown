import mongoose from 'mongoose';
import Node from '@/modules/projects/nodes/node.model';
import dotenv from 'dotenv';
import User from '@/modules/users/user.model';
import Workspace from '@/modules/workspaces/workspace.model';
import Project from '@/modules/projects/project.model';
import WorkspaceMember from '@/modules/workspaces/members/member.model';
import ProjectMember from '@/modules/projects/member/member.model';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
const userData = {
  email: 'emonawong1@gmail.com',
  isOnboard: true,
  password: '$2b$10$yUsW60uI3mIQPs0BeY3te.Re8c2tz2hV6TbjcV3ZUey2sRApgBuT6', //qweqwe
  role: 'user',
  email_verified: true,
  image: null,
  company: '',
  country: '',
  phoneNumber: '',
  family_name: 'User1',
  given_name: 'User1',
  goal: 'Real-time collaboration',
  last_login: '2025-12-27T06:53:06.347Z',
};

const workspaceData = {
  title: 'workspace 1',
};

const projectData = {
  title: 'project 1',
};
const workspaceMemberData = {
  role: 'owner',
  status: 'accepted',
};

const projectMemberData = {
  role: 'owner',
};
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🚀 Connected to MongoDB');

    await User.deleteOne({ email: userData.email }, { new: true });
    const user = await User.create(userData);

    await Workspace.deleteOne({ title: workspaceData.title }, { new: true });
    const workspace = await Workspace.create({ ...workspaceData, ownerUserId: user._id });

    await WorkspaceMember.deleteMany();
    await WorkspaceMember.create({ ...workspaceMemberData, workspaceId: workspace._id, email: user.email });

    await Project.deleteOne({ title: projectData.title }, { new: true });
    const project = await Project.create({ ...projectData, workspaceId: workspace._id, createdBy: user._id });

    await ProjectMember.deleteMany();
    await ProjectMember.create({ ...projectMemberData, workspaceId: workspace._id, projectId: project._id, email: user.email });

    const BASE = {
      workspaceId: workspace._id,
      projectId: project._id,
    };

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
