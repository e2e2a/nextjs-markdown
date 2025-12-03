import { tokenRepository } from '@/repositories/token';
import { generateRandomString } from '@/lib/generateRandomString';
import jwt from 'jsonwebtoken';
import { rateLimitService } from './rateLimit';
import { HttpError } from '@/lib/error';
import { hashText } from '@/lib/bcrypt';

export const tokenService = {
  generateToken: async (
    email: string,
    type: 'EmailVerification' | 'ChangeEmailVerification',
    emailToChange?: string
  ) => {
    const now = new Date();
    const TOKEN_LIFETIME = 24 * 60 * 60 * 1000; // 24h
    const CODE_LIFETIME = 5 * 60 * 1000; // 5min
    const token = jwt.sign({ email, type }, process.env.JWT_SECRET!);

    const tokenDoc = await tokenRepository.getToken({ email, type });
    const code = await generateRandomString();
    const hashCode = await hashText(code);
    if (!tokenDoc) {
      const newToken = await tokenRepository.create({
        email,
        emailToChange,
        type,
        token,
        code: hashCode,
        expires: new Date(now.getTime() + TOKEN_LIFETIME),
        expiresCode: new Date(now.getTime() + CODE_LIFETIME),
      });

      return newToken;
    }

    if (tokenDoc.expiresCode < now) {
      tokenDoc.code = await generateRandomString();
      tokenDoc.expiresCode = new Date(now.getTime() + CODE_LIFETIME);
    }

    tokenDoc.token = token;
    await tokenDoc.save();

    return { token: tokenDoc.token, email: tokenDoc.email, code, type: tokenDoc.type };
  },

  getToken: async (token: string) => {
    const tokenDoc = await tokenRepository.getToken({ token });
    if (!tokenDoc) throw new HttpError('Invalid or expired token.', 404);
    if (tokenDoc.expires < new Date()) throw new HttpError('Token has expired.', 410);

    return tokenDoc;
  },

  resendCode: async (token: string) => {
    const tokenDoc = await tokenRepository.getToken({ token });
    if (!tokenDoc) throw new HttpError('Invalid token.', 404);
    const now = new Date();
    const code = await generateRandomString();
    const hashCode = await hashText(code);
    const expiresCode = new Date(now.getTime() + 5 * 60 * 1000);
    tokenDoc.expiresCode = expiresCode;
    tokenDoc.code = hashCode;
    await rateLimitService.checkLimit('sendEmail', tokenDoc.email);
    await tokenDoc.save();

    return { token: tokenDoc.token, email: tokenDoc.email, code, type: tokenDoc.type };
  },
};
