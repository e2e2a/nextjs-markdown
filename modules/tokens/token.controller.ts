import { tokenService } from './token.service';

export const tokenController = {
  getToken: async (token: string) => {
    return await tokenService.getToken(token);
  },

  resendCode: async (token: string) => {
    return await tokenService.resendCode(token);
  },
};
