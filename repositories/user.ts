import User from '@/models/user';
import { IUser } from '@/types';
const updateOptions = { new: true, runValidators: true };

export const userRepository = {
  findUser: async (id: string, excludePassword: boolean) => {
    let query = User.findById(id);
    if (excludePassword) query = query.select('-password');

    const user = await query.exec();
    return user;
  },

  create: (data: { password: string } & Partial<IUser>) => new User(data).save(),

  updateUserBy: async (data: Partial<IUser>, dataToUpdate: Partial<{ password: string } & IUser>) =>
    User.findOneAndUpdate(data, dataToUpdate, updateOptions).exec(),

  findUserBy: async (data: Partial<IUser>, excludePassword: boolean) => {
    let query = User.findOne(data);
    if (excludePassword) query = query.select('-password');

    const user = await query.exec();
    return user;
  },
};
