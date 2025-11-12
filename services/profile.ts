import { HttpError } from '@/lib/error';
import { profileRepository } from '@/repositories/profile';
import { KBAData } from '@/types';
import bcrypt from 'bcrypt';
import { accessRecordService } from './accessRecord';
import { kbaSchema } from '@/lib/validators/kba';

export const profileService = {
  async verifyOrCreateKBA(userId: string, kbaData: KBAData) {
    const parsed = kbaSchema.safeParse(kbaData);
    if (!parsed.success) {
      const messages = parsed.error.issues.map(issue => issue.message).join(', ');
      throw new HttpError(messages, 400);
    }

    const profile = await profileRepository.findByUserId(userId);
    if (!profile) throw new HttpError('Profile not found', 404);

    if (!profile.kbaQuestion && !profile.kbaAnswer) {
      profile.kbaQuestion = parsed.data.kbaQuestion;
      const hashed = await bcrypt.hash(parsed.data.kbaAnswer, 10);
      profile.kbaAnswer = hashed;
      await profile.save();
    } else {
      const isValid = await bcrypt.compare(parsed.data.kbaAnswer, profile.kbaAnswer);
      if (!isValid) throw new HttpError(`Invalid Answer.`, 403);
    }

    await accessRecordService.create({
      lastLogin: new Date(),
      userId: profile.userId as string,
    });

    return profile;
  },
};
