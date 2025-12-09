const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`;

export const authClient = {
  async login(data: { email: string; password: string }) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },

  async register(data: { email: string; password: string }) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },

  async verifyEmail(data: { token: string; code: string }) {
    const res = await fetch(`${BASE_URL}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },
};
