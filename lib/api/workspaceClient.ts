import { IWorkspaceMemberCreateDTO } from '@/types';
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspace`;

export const workspaceClient = {
  async create(data: { title: string; members: IWorkspaceMemberCreateDTO[] }) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },

  async createProject(data: {
    title: string;
    workspaceId: string;
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
    }[];
  }) {
    const res = await fetch(`${BASE_URL}/${data.workspaceId}/project/me`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },

  async getWorkspaceMember(workspaceId: string) {
    const res = await fetch(`${BASE_URL}/${workspaceId}/member/`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },

  async getUserWorkspaces() {
    const res = await fetch(`${BASE_URL}/me`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },

  async getWorkspaceProjects(workspaceId: string) {
    const res = await fetch(`${BASE_URL}/${workspaceId}/project/me`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },

  async leave(workspaceId: string) {
    const res = await fetch(`${BASE_URL}/${workspaceId}/member/me`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },
};
