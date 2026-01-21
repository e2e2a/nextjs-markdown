const BASE_URL = '/api/node';
const BASE_URL_PROJECT = `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`;

export const nodeClient = {
  async getNodes(projectId: string) {
    const res = await fetch(`${BASE_URL_PROJECT}/${projectId}/nodes`);
    if (!res.ok) throw new Error('Failed to fetch nodes');
    return res.json();
  },

  async getNode(id: string) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch node with id ${id}`);
    return res.json();
  },

  async create(data: {
    projectId: string;
    parentId: string | null;
    type: 'file' | 'folder';
    title: string;
  }) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async update(data: { _id: string; title?: string; content?: string }) {
    const res = await fetch(`${BASE_URL}/${data._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async move(data: { _id: string; parentId: string | null }) {
    const res = await fetch(`${BASE_URL}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async trash(data: { _id: string }) {
    const res = await fetch(`${BASE_URL}/${data._id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },
};
