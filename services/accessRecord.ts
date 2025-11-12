// import { HttpError } from '@/lib/error';
import { getHeaders } from '@/lib/getHeaders';
import { accessRecordRepository } from '@/repositories/accessRecord';
import { CreateAccessRecordDTO, IAccessRecord } from '@/types';

export const accessRecordService = {
  create: async (data: { lastLogin: Date; userId: string }) => {
    const getHead = await getHeaders();
    const payload = {
      ...data,
      ...getHead,
    };
    const accessRecord = await accessRecordRepository.create(payload as CreateAccessRecordDTO);
    return accessRecord;
  },

  findAccessRecord: async (data: Partial<IAccessRecord>) => {
    const accessRecord = await accessRecordRepository.findAccessRecord(data);
    return accessRecord;
  },

  findAccessRecordAndUpdate: async (
    data: Partial<IAccessRecord>,
    updateData: { lastLogin: Date }
  ) => {
    const accessRecord = await accessRecordRepository.findAccessRecordAndUpdate(data, updateData);
    return accessRecord;
  },
};
