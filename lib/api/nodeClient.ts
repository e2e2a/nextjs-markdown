import { CreateNodeDTO, UpdateNodeDTO } from '@/types';
const BASE_URL = '/api/node';
const BASE_URL_PROJECT = `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`;

export async function getNodes(projectId: string) {
  const res = await fetch(`${BASE_URL_PROJECT}/${projectId}/nodes`);
  if (!res.ok) throw new Error('Failed to fetch nodes');
  return res.json();
}

export async function getNode(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch node with id ${id}`);
  return res.json();
}

export async function createNode(data: CreateNodeDTO) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || '');
  return json;
}

export async function updateNode(data: UpdateNodeDTO) {
  const res = await fetch(`${BASE_URL}/${data._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || '');
  return json;
}
