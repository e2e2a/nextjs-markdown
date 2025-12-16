import { Metadata } from 'next';
import { AccessUsersClient } from './components/access-users-client';

export const metadata: Metadata = {
  title: 'My Teams',
};

const Page = () => {
  return <AccessUsersClient />;
};

export default Page;
