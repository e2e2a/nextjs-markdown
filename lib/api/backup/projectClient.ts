import { CreateProjectDTO, UpdateProjectDTO } from '@/types';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/project`;

export const projectClient = {
  async createProject(data: CreateProjectDTO) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async findProject(id: string, cookieHeader?: string) {
    const res = await fetch(BASE_URL + `/${id}`, {
      headers: {
        Cookie: cookieHeader || '',
      },
      cache: 'no-store',
    });
    const json = await res.json();
    if (!res.ok) return null;
    return json;
  },

  async getProjectsByUserId(userId?: string) {
    const res = await fetch(BASE_URL + `?userId=${userId}`);
    const json = await res.json();
    if (!res.ok) throw new Error('Failed to fetch projects');
    return json;
  },

  async updateProject(data: { _id: string } & UpdateProjectDTO) {
    const res = await fetch(`${BASE_URL}/${data._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },
};
