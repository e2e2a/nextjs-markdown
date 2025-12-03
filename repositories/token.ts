import Token from '@/models/token';
import { IToken } from '@/types';
const updateOptions = { new: true, runValidators: true };

export const tokenRepository = {
  create: (data: Partial<IToken>) => new Token(data).save(),

  findByUserId: (userId: string) => Token.findOne({ userId }).exec(),

  getToken: async (data: Partial<IToken>) => Token.findOne(data).exec(),

  updateTokenBy: (data: Partial<IToken>, dataToUpdate: Partial<IToken>) =>
    Token.findOneAndUpdate(data, dataToUpdate, updateOptions).exec(),

  updateToken: (id: string, data: Partial<IToken>) =>
    Token.findByIdAndUpdate(id, data, updateOptions).exec(),

  deleteToken: (_id: string) => Token.deleteOne({ _id }).exec(),
};
