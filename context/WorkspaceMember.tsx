'use client';

import { useGetMemberWithWorkspace } from '@/hooks/workspasceMember/useQueries';
import { IWorkspace, IWorkspaceMember } from '@/types';
import { notFound, useParams } from 'next/navigation';
import React, { createContext, useContext } from 'react';

interface WorkspaceMemberContextValue {
  workspace: IWorkspace;
  membership: IWorkspaceMember;
  loading: boolean;
  error: Error | null;
}

const WorkspaceMemberContext = createContext<WorkspaceMemberContextValue | null>(null);

export function WorkspaceMemberProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const workspaceId = params.id as string;
  const { data, isLoading, error } = useGetMemberWithWorkspace(workspaceId);
  if (isLoading) return;
  if (error) return notFound();

  return <WorkspaceMemberContext.Provider value={data}>{children}</WorkspaceMemberContext.Provider>;
}

export function useWorkspaceMember() {
  const context = useContext(WorkspaceMemberContext);

  if (!context) {
    throw new Error('useWorkspaceMember must be used within WorkspaceMemberProvider');
  }

  return context;
}
