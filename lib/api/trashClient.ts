import { ArchivedItem } from '@/types';

const BASE_URL = '/api/trash';

export async function getArhivedByUserId() {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || '');
  return json;
}

export async function retrieveItem(data: ArchivedItem) {
  const res = await fetch(`${BASE_URL}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || '');
  return json;
}

export async function deleteItem(data: ArchivedItem[]) {
  const res = await fetch(`${BASE_URL}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || '');
  return json;
}
