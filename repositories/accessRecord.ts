import { AccessRecord } from '@/models/accessRecord';
import { CreateAccessRecordDTO, IAccessRecord } from '@/types';

export const accessRecordRepository = {
  create: (data: CreateAccessRecordDTO) => new AccessRecord(data).save(),

  findAccessRecord: async (data: Partial<IAccessRecord>) =>
    AccessRecord.findOne(data).lean<IAccessRecord>().exec(),

  findAccessRecordAndUpdate: async (
    data: Partial<IAccessRecord>,
    updateData: { lastLogin: Date }
  ) =>
    AccessRecord.findOneAndUpdate(data, updateData, { new: true, runValidators: true })
      .lean<IAccessRecord>()
      .exec(),
};
