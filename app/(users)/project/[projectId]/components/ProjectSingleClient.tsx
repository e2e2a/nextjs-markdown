'use client';
import { useEffect, useState } from 'react';
// import 'easymde/dist/easymde.min.css';
// import 'codemirror';
import AppSidebarLayout from '@/components/markdown/app-sidebar-layout';
import { useProjectQuery } from '@/hooks/project/useProjectQuery';
import { generateBreadcrumbs } from '@/hooks/use-generate-breadcrumbs';
import { INode } from '@/types';
import mongoose from 'mongoose';
import { notFound, useParams } from 'next/navigation';
import { MarkdownSection } from './MarkdownSection';
import { useSession } from 'next-auth/react';

export function ProjectSingleClient() {
  const [active, setActive] = useState<Partial<INode> | null>(null);
  const params = useParams();
  const projectId = params.projectId as string;
  const { data: session, status } = useSession();

  const [prevActive, setPrevActive] = useState<Partial<INode> | null>(null);
  const { data: project, isLoading: loading, error } = useProjectQuery(projectId);
  console.log('[PAGE PROJECT]', project);
  console.log('[PAGE ACTIVE]', active);
  const nodes = project?.nodes as INode[] | [];
  const node = project?.nodes?.find((n: INode) => n._id === prevActive?._id) as INode; // create another api to get single node
  const breadcrumbs = generateBreadcrumbs(nodes, node);

  useEffect(() => {
    if (project && active && active.type === 'file') {
      if (prevActive?._id === active._id) return;
      requestAnimationFrame(() => {
        setPrevActive(active);
      });
    }
    return;
  }, [project, active, prevActive?._id]);

  if (status === 'loading') return;
  if (!mongoose.Types.ObjectId.isValid(projectId)) return <div>Project ID is required</div>;
  if (loading) return <div>Loading...</div>;
  if (!project || error) return notFound();

  return (
    <AppSidebarLayout
      project={project}
      nodes={nodes}
      breadcrumbs={breadcrumbs}
      setActive={setActive}
      active={active}
    >
      {/* Editor Section */}
      {prevActive ? (
        <MarkdownSection node={prevActive as INode} session={session!} />
      ) : (
        <div className="p-5">
          Select a file to start <span className="text-blue-500">editing</span>.
        </div>
      )}
    </AppSidebarLayout>
  );
}
