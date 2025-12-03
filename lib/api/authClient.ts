import { AuthUser } from '@/types';
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`;

export const authClient = {
  async auth(data: AuthUser) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');

    return json;
  },
};
