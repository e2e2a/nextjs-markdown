import { compareText } from '@/lib/bcrypt';
import { HttpError } from '@/lib/error';
import { tokenRepository } from '@/repositories/token';
import { userRepository } from '@/repositories/user';
import { rateLimitService } from './rateLimit';
import { IOnboard } from '@/types';
import { Step1Schema, Step2Schema, Step3Schema } from '@/lib/validators/onboard';
import { workspaceRepository } from '@/repositories/workspace';

export const userService = {
  verifyEmailByCodeAndToken: async (data: { code: string; token: string }) => {
    const tokenDoc = await tokenRepository.getToken({ token: data.token });
    if (!tokenDoc) throw new HttpError('Invalid or expired token.', 404);

    if (tokenDoc.expires < new Date()) throw new HttpError('Token has expired.', 410);
    const limit = await rateLimitService.checkLimit('verify', tokenDoc.email);
    if (tokenDoc.expiresCode < new Date()) throw new HttpError('Code has expired.', 410);

    const verify = await compareText(data.code, tokenDoc.code);
    if (!verify) throw new HttpError('Code does not matched.', 403);
    const user = await userRepository.updateUserBy(
      { email: tokenDoc.email },
      { email_verified: true }
    );
    if (!user) throw new HttpError('No user Found.', 404);

    await tokenRepository.deleteToken(tokenDoc._id);
    return { email: user.email, retries: limit?.retryCount };
  },

  onboard: async (data: IOnboard, userId: string) => {
    const result1 = Step1Schema.safeParse(data.step1);
    const result2 = Step2Schema.safeParse(data.step2);
    const result3 = Step3Schema.safeParse(data.step3);
    if (!result1.success || !result2.success || !result3.success)
      throw new HttpError('Invalid fields.', 400);
    const user = userRepository.updateUserBy(
      { _id: userId },
      {
        ...result1.data,
        ...result2.data,
        isOnboard: true,
      }
    );
    if (!user) throw new HttpError('No user found.', 404);
    const workspace = await workspaceRepository.create({ ...result3.data, ownerUserId: userId });
    if (!workspace) throw new HttpError('Something went wrong.', 500);
    return { workspaceId: workspace._id };
  },
};
