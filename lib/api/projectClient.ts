const BASE_URL_PROJECTS = `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`;
// const BASE_URL_WORKSPACES = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspaces`;

export const projectClient = {
  async create(data: {
    title: string;
    workspaceId: string;
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
    }[];
  }) {
    const res = await fetch(`${BASE_URL_PROJECTS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },

  async update(data: { pid: string; title: string }) {
    const res = await fetch(`${BASE_URL_PROJECTS}/${data.pid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: data.title }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },

  async move(data: { pid: string; wid: string }) {
    const res = await fetch(`${BASE_URL_PROJECTS}/${data.pid}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId: data.wid }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },

  async delete(data: { pid: string }) {
    const res = await fetch(`${BASE_URL_PROJECTS}/${data.pid}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },

  async getProjectsByWorkspace(workspaceId: string) {
    const res = await fetch(`${BASE_URL_PROJECTS}?wid=${workspaceId}`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },

  // async findProject(id: string, cookieHeader?: string) {
  //   const res = await fetch(BASE_URL_PROJECTS + `/${id}`, {
  //     headers: {
  //       Cookie: cookieHeader || '',
  //     },
  //     cache: 'no-store',
  //   });
  //   const json = await res.json();
  //   if (!res.ok) return null;
  //   return json;
  // },

  // async getProjectsByUserId(userId?: string) {
  //   const res = await fetch(BASE_URL_PROJECTS + `?userId=${userId}`);
  //   const json = await res.json();
  //   if (!res.ok) throw new Error('Failed to fetch projects');
  //   return json;
  // },

  // async updateProject(data: { _id: string } & UpdateProjectDTO) {
  //   const res = await fetch(`${BASE_URL_PROJECTS}/${data._id}`, {
  //     method: 'PATCH',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data),
  //   });
  //   const json = await res.json();
  //   if (!res.ok) throw new Error(json.message || '');
  //   return json;
  // },
};
