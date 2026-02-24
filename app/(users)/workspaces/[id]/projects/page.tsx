import { Metadata } from 'next';
import { WorkspaceProjectsClient } from './components/workspace-projects-client';

export const metadata: Metadata = {
  title: 'My Projects',
};

const Page = () => {
  return <WorkspaceProjectsClient />;
};

export default Page;
