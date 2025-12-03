const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/token`;

export const tokenClient = {
  async getTokenByToken(token: string) {
    const res = await fetch(BASE_URL + `?token=${token}`);
    const json = await res.json();
    if (!res.ok) throw new Error('Failed to fetch token');
    return json;
  },

  async resendCode(token: string) {
    const res = await fetch(`${BASE_URL}/resend`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },
};
