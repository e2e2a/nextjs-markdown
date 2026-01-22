import { compareText, hashText } from '@/lib/bcrypt';
import { HttpError } from '@/utils/server/errors';
import { loginSchema } from '@/lib/validators/login';
import { validateRegisterSchema } from '@/lib/validators/register';
import { userRepository } from '@/modules/users/user.repository';
import { AuthUser } from '@/types';
import { tokenService } from '../modules/tokens/token.service';
import nodemailer from 'nodemailer';
import { verificationTemplate } from '@/components/email-template/verification-code';
import { rateLimitService } from '../modules/rateLimits/rateLimit.service';
import { tokenRepository } from '@/modules/tokens/token.repository';

const sendEmail = async (email: string, subject: string, type: 'EmailVerification' | 'ChangeEmailVerification', code: string) => {
  try {
    const html = await verificationTemplate(code, type);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = { from: process.env.EMAIL, to: email, subject, html };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
};

export const authServices = {
  login: async (data: { email: string; password: string }) => {
    const result = loginSchema.safeParse(data);
    if (!result.success) throw new HttpError('BAD_INPUT', 'Invalid fields');

    await rateLimitService.checkLimit('login', data.email);

    const user = await userRepository.findUserByEmail(result.data.email, false);
    if (!user) throw new HttpError('CONFLICT', 'Email has not been yet registered');
    if (!user.password) throw new HttpError('CONFLICT', 'Account is linked to another provider');
    if (!user.email_verified) throw new HttpError('BAD_INPUT', 'Email is not verified');

    const verify = await compareText(result.data.password, user.password);
    if (!verify) throw new HttpError('BAD_INPUT', 'Invalid Credentials');

    return user;
  },

  register: async (data: AuthUser) => {
    const result = validateRegisterSchema.safeParse(data);
    if (!result.success) throw new HttpError('BAD_INPUT', 'Invalid fields.');
    let user = null;
    user = await userRepository.findUserByEmail(result.data.email, false);
    const hashedPassword = await hashText(result.data.password);
    if (user) {
      if (user.email_verified) throw new HttpError('CONFLICT', 'Email already exists in this level');
      user.password = hashedPassword;
      await user.save();
    } else {
      user = await userRepository.create({
        email: result.data.email,
        password: hashedPassword,
      });
    }

    await rateLimitService.checkLimit('register', data.email); // set rateLimit for register

    const token = await tokenService.generateToken(user.email, 'EmailVerification');

    sendEmail(user.email, 'Verification Code', token.type, token.code);
    return { email: data.email, token: token.token };
  },

  verifyEmailByCodeAndToken: async (data: { code: string; token: string }) => {
    const tokenDoc = await tokenRepository.getToken({ token: data.token });
    if (!tokenDoc) throw new HttpError('NOT_FOUND', 'Invalid or expired token.');

    if (tokenDoc.expires < new Date()) throw new HttpError('GONE', 'Token has expired.');
    const limit = await rateLimitService.checkLimit('verify', tokenDoc.email);
    if (tokenDoc.expiresCode < new Date()) throw new HttpError('GONE', 'Code has expired.');

    const verify = await compareText(data.code, tokenDoc.code);
    if (!verify) throw new HttpError('FORBIDDEN', 'Code does not matched.');
    const user = await userRepository.updateUserByEmail(tokenDoc.email, { email_verified: true });
    if (!user) throw new HttpError('NOT_FOUND', 'No user Found.');

    await tokenRepository.deleteToken(tokenDoc._id);
    return { email: user.email, retries: limit?.retryCount };
  },
};
