import { Metadata } from 'next';
import { ProjectClient } from './components/project-client';

export const metadata: Metadata = {
  title: 'My Projects',
};

export default function Page() {
  return <ProjectClient />;
}
