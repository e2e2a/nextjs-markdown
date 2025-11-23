import { projectClient } from '@/lib/api/projectClient';
import { ProjectSingleClient } from './components/ProjectSingleClient';
import { headers } from 'next/headers';

export const generateMetadata = async ({
  params,
}: {
  params: { projectId: string } | Promise<{ projectId: string }>;
}) => {
  const resolvedParams = await params;
  const projectId = resolvedParams.projectId;

  const headersList = await headers();
  const cookieHeader = headersList.get('cookie');

  const project = await projectClient.findProject(projectId, cookieHeader!);
  if (!project) {
    return { title: 'Project Not Found' };
  }
  const capitalizedTitle = project.title.charAt(0).toUpperCase() + project.title.slice(1);

  return {
    title: capitalizedTitle,
  };
};

export default function Page() {
  return <ProjectSingleClient />;
}
