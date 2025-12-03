import { RateLimit } from '@/models/rateLimit';
import { CreateIRateLimitDTO, IRateLimit } from '@/types';

export const rateLimitRepository = {
  create: (data: CreateIRateLimitDTO) => new RateLimit(data).save(),

  findAccessRecord: async (data: Partial<IRateLimit>) => RateLimit.findOne(data).exec(),

  findAccessRecordAndUpdate: async (data: Partial<IRateLimit>, updateData: Partial<IRateLimit>) =>
    RateLimit.findOneAndUpdate(data, updateData, { new: true, runValidators: true })
      .lean<IRateLimit>()
      .exec(),
};
