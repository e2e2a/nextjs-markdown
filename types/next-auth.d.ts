import { DefaultSession, DefaultUser } from 'next-auth';
import { AdapterUser as DefaultAdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
  interface User extends DefaultUser {
    _id?: string;
    sub?: string;
    email: string;
    role?: 'user' | 'admin';
    email_verified?: boolean;
    isOnboard: boolean;

    /** Keep this and ignore for NextAuth compatibility */
    emailVerified: Date | null;
  }

  interface Session {
    deleted: boolean;
    user: {
      _id?: string;
      sub?: string;
      username: string;
      email: string;
      role?: 'user' | 'admin';
      email_verified?: boolean;
      isOnboard: boolean;
      emailVerified: Date | null;
    } & DefaultSession['user'];
  }
}

export type NullableSession = Session | null;

declare module 'next-auth/adapters' {
  interface AdapterUser extends DefaultAdapterUser {
    _id?: string;
    username?: string;
    role?: 'user' | 'admin';
    email_verified?: boolean;
    isOnboard?: boolean;
    /** Required by NextAuth core */
    emailVerified: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    role?: 'user' | 'admin';
    email: string;
  }
}

export type NullableJWT = JWT | null;
