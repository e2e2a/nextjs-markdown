import { authServices } from './auth.service';
import { AuthDTO } from './auth.dto';
import { HttpError } from '@/utils/server/errors';
import { AuthUser } from '@/types';

export const authController = {
  login: async (body: { email: string; password: string }) => {
    const validatedBody = AuthDTO.login.safeParse(body);
    if (!validatedBody.success) {
      const errorMessage = validatedBody.error.issues[0].message;
      throw new HttpError('BAD_INPUT', errorMessage);
    }

    return await authServices.login(validatedBody.data);
  },
  register: async (body: AuthUser) => {
    const validatedBody = AuthDTO.register.safeParse(body);
    if (!validatedBody.success) {
      const errorMessage = validatedBody.error.issues[0].message;
      throw new HttpError('BAD_INPUT', errorMessage);
    }

    return await authServices.register(validatedBody.data);
  },
  verifyEmail: async (body: { code: string; token: string }) => {
    return await authServices.verifyEmailByCodeAndToken(body);
  },
};
