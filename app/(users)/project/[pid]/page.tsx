import { projectClient } from '@/lib/api/projectClient';
import { ProjectSingleClient } from './components/ProjectSingleClient';
import { headers } from 'next/headers';

export const generateMetadata = async ({
  params,
}: {
  params: { pid: string } | Promise<{ pid: string }>;
}) => {
  const resolvedParams = await params;
  const projectId = resolvedParams.pid;
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie');
  try {
    const project = await projectClient.getProjectById(projectId, cookieHeader!);
    if (!project) {
      return { title: 'Project Not Found' };
    }
    const capitalizedTitle = project.title.charAt(0).toUpperCase() + project.title.slice(1);
    return {
      title: capitalizedTitle,
    };
  } catch {
    return { title: 'Project Not Found' };
  }
};

export default function Page() {
  return <ProjectSingleClient />;
}
