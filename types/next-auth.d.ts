// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth';
import { AdapterUser as DefaultAdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
  interface User extends DefaultUser {
    _id?: string;
    sub?: string;
    username: string;
    email: string;
    role?: 'user' | 'admin';
    kbaVerified?: boolean;
    email_verified?: boolean;
    /** Keep this for NextAuth compatibility */
    emailVerified: Date | null;
  }

  interface Session {
    user: {
      _id?: string;
      sub?: string;
      username: string;
      email: string;
      role?: 'user' | 'admin';
      kbaVerified?: boolean;
      email_verified?: boolean;
      emailVerified: Date | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser extends DefaultAdapterUser {
    _id?: string;
    username?: string;
    role?: 'user' | 'admin';
    email_verified?: boolean;
    /** Required by NextAuth core */
    emailVerified: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    role?: 'user' | 'admin';
  }
}
