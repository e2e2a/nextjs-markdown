import { Metadata } from 'next';
import { TeamClient } from './components/team-client';

export const metadata: Metadata = {
  title: 'My Teams',
};

export default function Page() {
  return <TeamClient />;
}
