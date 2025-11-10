// lib/nodeClient.ts

import { CreateNodeDTO, UpdateNodeDTO } from '@/types';
const BASE_URL = '/api/node';

// 🔹 Get all nodes
export async function getNodes(projectId?: string) {
  const res = await fetch(BASE_URL + `${projectId ? `?projectId=${projectId}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch nodes');
  return res.json();
}

// 🔹 Get one node by ID
export async function getNode(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch node with id ${id}`);
  return res.json();
}

// 🔹 Create a new node
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

// 🔹 Update an existing node
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
