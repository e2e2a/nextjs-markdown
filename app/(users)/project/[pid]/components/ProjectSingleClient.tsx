'use client';
import { useEffect, useState } from 'react';
// import 'easymde/dist/easymde.min.css';
// import 'codemirror';
import AppSidebarLayout from '@/components/markdown/app-sidebar-layout';
import { INode } from '@/types';
import { notFound, useParams } from 'next/navigation';
// import { MarkdownSection } from './MarkdownSection';
import { useProjectByIdQuery } from '@/hooks/project/useProjectQuery';

export function ProjectSingleClient() {
  const [active, setActive] = useState<INode | null>(null);
  const params = useParams();
  const pid = params.pid as string;

  const [prevActive, setPrevActive] = useState<INode | null>(null);
  const { data: pData, isLoading: pLoading, error: pError } = useProjectByIdQuery(pid);
  // const node = nData?.nodes?.find((n: INode) => n._id === prevActive?._id) as INode; // create another api to get single node
  // const breadcrumbs = generateBreadcrumbs(nData?.nodes, null);

  useEffect(() => {
    if (pData && active && active.type === 'file') {
      if (prevActive?._id === active._id) return;
      requestAnimationFrame(() => {
        setPrevActive(active);
      });
    }
    return;
  }, [pData, active, prevActive?._id]);

  if (pLoading) return <div>Loading...</div>;
  if (pError) return notFound();

  return (
    // <AppSidebarLayout breadcrumbs={breadcrumbs} setActive={setActive} active={active}>
    <AppSidebarLayout setActive={setActive} active={active}>
      {/* Editor Section */}
      {/* {prevActive ? (
        <MarkdownSection node={prevActive as INode} session={session!} />
      ) : (
        <div className="p-5">
          Select a file to start <span className="text-blue-500">editing</span>.
        </div>
      )} */}
      PLACHOLDER(EMPTY)
    </AppSidebarLayout>
  );
}
