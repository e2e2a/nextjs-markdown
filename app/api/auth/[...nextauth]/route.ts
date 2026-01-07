import NextAuth, { SessionStrategy, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/db/adapter';
import { authCallbacks } from '@/lib/nextauth/callbacks';
import { userRepository } from '@/modules/users/user.repository';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AdapterUser } from 'next-auth/adapters';
import { NullableJWT } from '@/types/next-auth';
import connectDb from '@/lib/db/connection';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  debug: true,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 60 * 60 * 24, // 1 day
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
          // prompt: "consent",
          // access_type: "offline",
          // response_type: "code"
        },
      },
      profile: async profile => {
        return {
          id: profile.sub,
          sub: profile.sub,
          username: profile.given_name,
          email: profile.email,
          image: null,
          role: 'user',
          email_verified: profile.email_verified,
          emailVerified: new Date(),
          isOnboard: false,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
      },
      async authorize(credentials): Promise<User | null> {
        await connectDb();
        if (!credentials) return null;
        const user = await userRepository.findUserByEmail(credentials.email, true);
        if (!user) return null;

        return {
          _id: user._id!.toString(),
          id: user._id!.toString(),
          email: user.email,
          role: user.role,
          email_verified: user.email_verified,
          isOnboard: user.isOnboarded,
          emailVerified: null, // next-auth problem
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: authCallbacks,
  events: {
    async signIn({ user }: { user: AdapterUser }) {
      if (user) {
        await connectDb();
        await userRepository.updateUserById(user.id!, { last_login: new Date() });
      }
    },

    async signOut({ token }: { token: NullableJWT }) {
      if (token) {
        await connectDb();
        await userRepository.updateUserById(token._id, { last_login: null });
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
