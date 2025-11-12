import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/db/adapter';
import { authCallbacks } from '@/lib/nextauth/callbacks';
import { userRepository } from '@/repositories/user';
import connectDb from '@/lib/db/connection';
import { profileRepository } from '@/repositories/profile';
import { AdapterUser } from 'next-auth/adapters';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  // debug: true,
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`,
        },
      },
      profile: async profile => {
        return {
          id: profile.sub,
          sub: profile.sub,
          username: profile.given_name,
          email: profile.email,
          role: 'user',
          email_verified: profile.email_verified,
          emailVerified: new Date(),
          kbaVerified: false,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: authCallbacks,
  events: {
    async createUser({ user }: { user: AdapterUser }) {
      console.log('✅ createUser event fired:', user);
      await connectDb();

      const authUser = await userRepository.findUser(user.id!);
      if (authUser)
        await profileRepository.updateByProviderAccountId(authUser.sub, {
          userId: authUser._id as string,
        });
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
