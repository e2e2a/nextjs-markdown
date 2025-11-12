import Profile from '@/models/profile';
import { CreateProfileDTO, IProfile } from '@/types';

export const profileRepository = {
  create: (data: CreateProfileDTO) => new Profile(data).save(),

  findByProviderAccountId: (sub: string) => Profile.findOne({ sub }).lean<IProfile>().exec(),

  findByUserId: (userId: string) => Profile.findOne({ userId }).exec(),

  updateByProviderAccountId: (sub: string, data: Partial<IProfile>) =>
    Profile.findOneAndUpdate({ sub }, { $set: data }, { new: true }),
};
