import { WorkspaceClient } from './components/workspace-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Teams',
};

const Page = () => {
  return (
    <div>
      <WorkspaceClient />
    </div>
  );
};

export default Page;
