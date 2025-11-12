import User, { IUser } from '@/models/user';

export const userRepository = {
  findUser: (id: string) => User.findById(id).lean<IUser>().exec(),
};
