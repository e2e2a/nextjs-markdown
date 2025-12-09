import { Metadata } from 'next';
import { WorkspaceProjectsClient } from './components/workspace-projects-client';

export const metadata: Metadata = {
  title: 'My Teams',
};

const Page = () => {
  return (
    <div>
      <WorkspaceProjectsClient />
    </div>
  );
};

export default Page;
