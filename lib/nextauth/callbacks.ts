import { Account, Profile, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import connectDb from '../db/connection';
import { profileRepository } from '@/repositories/profile';
import { IAccessRecord, IProfile } from '@/types';
import { userRepository } from '@/repositories/user';
import { AdapterUser } from 'next-auth/adapters';
import { accessRecordService } from '@/services/accessRecord';
import { getHeaders } from '../getHeaders';
import mongoose from 'mongoose';

export const authCallbacks = {
  async signIn(params: {
    user: User | AdapterUser;
    account: Account | null;
    profile?: Profile;
    email?: { verificationRequest?: boolean };
    credentials?: Record<string, unknown>;
  }): Promise<boolean> {
    const { user, account, profile } = params;
    try {
      await connectDb();

      if (account?.provider === 'google') {
        if (!profile) return false;
        const existingProfile = await profileRepository.findByProviderAccountId(
          profile.sub as string
        );
        console.log('running', existingProfile);
        if (!existingProfile) await profileRepository.create(profile as IProfile);
        if (mongoose.Types.ObjectId.isValid(user.id)) {
          const { ip, deviceType } = await getHeaders();
          const payload = {
            userId: user.id as string,
            ip,
            deviceType,
          };
          await accessRecordService.findAccessRecordAndUpdate(payload as Partial<IAccessRecord>, {
            lastLogin: new Date(),
          });
        }
        return true;
      }
    } catch {
      return false;
    }

    return true;
  },
  async session(params: { session: Session; user: AdapterUser; token: JWT }) {
    const { session, token } = params;
    await connectDb();
    console.log('runningqwe', token);

    if (token && token._id) {
      session.user._id = token._id as string;
      session.user.sub = token.sub as string;
      const authUser = await userRepository.findUser(token._id);
      if (authUser) {
        session.user.username = authUser.username as string;
        session.user.email = authUser.email as string;
        session.user.role = authUser.role as 'user' | 'admin';
        session.user.email_verified = authUser.email_verified;

        const { ip, deviceType } = await getHeaders();
        const payload = {
          userId: authUser._id.toString(),
          ip,
          deviceType,
        };
        const accessRecord = await accessRecordService.findAccessRecord(
          payload as Partial<IAccessRecord>
        );
        session.user.kbaVerified = !!accessRecord;
      }
    }
    return session;
  },

  async jwt(params: {
    token: JWT;
    user?: User | AdapterUser;
    account?: Account | null;
    profile?: Profile;
  }) {
    const { token, user } = params;

    if (user) {
      token._id = user.id;
      token.role = user.role;
      token.email = user.email as string;
      token.role = user.role as 'user' | 'admin';
      token.email_verified = user.email_verified;
      token.tryingSomething = 'asd'
    }

    return token;
  },
};
