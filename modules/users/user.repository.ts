import User from '@/modules/users/user.model';
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

  updateUserById: async (uid: string, dataToUpdate: Partial<{ password: string } & IUser>) =>
    User.findByIdAndUpdate(uid, dataToUpdate, updateOptions).exec(),

  updateUserByEmail: async (email: string, dataToUpdate: Partial<{ password: string } & IUser>) =>
    User.findOneAndUpdate({ email }, dataToUpdate, updateOptions).exec(),

  findUserByEmail: async (email: string, excludePassword: boolean) => {
    let query = User.findOne({ email });
    if (excludePassword) query = query.select('-password');

    const user = await query.exec();
    return user;
  },
};
