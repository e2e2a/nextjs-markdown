'use client';
import { useEffect, useState } from 'react';
import 'easymde/dist/easymde.min.css';
import 'codemirror';
import AppSidebarLayout from '@/components/markdown/app-sidebar-layout';
import { useProjectQuery } from '@/hooks/project/useProjectQuery';
// import { IProject } from '@/models/project';
import { generateBreadcrumbs } from '@/hooks/use-generate-breadcrumbs';
import { INode } from '@/types';
import mongoose from 'mongoose';
import MarkdownSection from './components/MarkdownSection';
import { useParams } from 'next/navigation';

export default function EasyMDEWithCommentToolbar() {
  const [active, setActive] = useState<Partial<INode> | null>(null);
  const params = useParams();
  const projectId = params.projectId as string;

  const [prevActive, setPrevActive] = useState<Partial<INode> | null>(null);
  // const [highlightedText, setHighlightedText] = useState('');
  const { data: project, isLoading: loading, error } = useProjectQuery(projectId);
  console.log('projects', project);
  // const project = projects?.find((p: IProject) => p._id === projectId);

  const nodes = project?.nodes as INode[] | [];
  const node = prevActive as INode;
  const breadcrumbs = generateBreadcrumbs(nodes, node);
  useEffect(() => {
    if (active && active.type === 'file') {
      requestAnimationFrame(() => {
        setPrevActive(active);
        // setValue(active.content || '');
      });
    }
    return;
  }, [active]);
  if (!mongoose.Types.ObjectId.isValid(projectId)) return <div>Project ID is required</div>;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  if (!project) return <div>Project not found</div>;
  // if (!projects || projects.length === 0) return <div>No projects</div>;

  return (
    <AppSidebarLayout
      project={project}
      nodes={nodes}
      breadcrumbs={breadcrumbs}
      setActive={setActive}
      active={active}
    >
      {/* Editor Section */}
      <MarkdownSection node={node} active={active} />
    </AppSidebarLayout>
  );
}
