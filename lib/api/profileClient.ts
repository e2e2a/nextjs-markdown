const BASE_URL = '/api/profile';

export const profileClient = {
  async updateKBA(data: { _id: string; kbaQuestion: string; kbaAnswer: string }) {
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
