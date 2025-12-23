import { compareText, hashText } from '@/lib/bcrypt';
import { HttpError } from '@/lib/error';
import { loginSchema } from '@/lib/validators/login';
import { validateRegisterSchema } from '@/lib/validators/register';
import { userRepository } from '@/modules/users/user.repository';
import { AuthUser } from '@/types';
import { tokenService } from '../modules/tokens/token.service';
import nodemailer from 'nodemailer';
import { verificationTemplate } from '@/components/email-template/verification-code';
import { rateLimitService } from './rateLimit';
import { tokenRepository } from '@/modules/tokens/token.repository';

const sendEmail = async (
  email: string,
  subject: string,
  type: 'EmailVerification' | 'ChangeEmailVerification',
  code: string
) => {
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
    if (!result.success) throw new HttpError('Invalid fields.', 400);

    await rateLimitService.checkLimit('login', data.email);

    const user = await userRepository.findUserByEmail(result.data.email, false);
    if (!user) throw new HttpError('Email has not been yet registered.', 409);
    if (!user.password) throw new HttpError('Account is linked to another provider.', 409);
    if (!user.email_verified) throw new HttpError('Email is not verified.', 400);

    const verify = await compareText(result.data.password, user.password);
    if (!verify) throw new HttpError('Invalid Credentials.', 409);

    return user;
  },

  register: async (data: AuthUser) => {
    const result = validateRegisterSchema.safeParse(data);
    if (!result.success) throw new HttpError('Invalid fields.', 400);
    let user = null;
    user = await userRepository.findUserByEmail(result.data.email, false);
    const hashedPassword = await hashText(result.data.password);
    if (user) {
      if (user.email_verified) throw new HttpError('Email already exists in this level.', 409);
      user.password = hashedPassword;
      await user.save();
    } else {
      user = await userRepository.create({
        email: result.data.email,
        password: hashedPassword,
      });
    }
    if (!user) throw new HttpError('Something went wrong.', 500);

    await rateLimitService.checkLimit('register', data.email); // set rateLimit for register

    const token = await tokenService.generateToken(user.email, 'EmailVerification');
    if (!token) throw new HttpError('Something went wrong.', 500);

    sendEmail(user.email, 'Verification Code', token.type, token.code);
    return { email: data.email, token: token.token };
  },

  verifyEmailByCodeAndToken: async (data: { code: string; token: string }) => {
    const tokenDoc = await tokenRepository.getToken({ token: data.token });
    if (!tokenDoc) throw new HttpError('Invalid or expired token.', 404);

    if (tokenDoc.expires < new Date()) throw new HttpError('Token has expired.', 410);
    const limit = await rateLimitService.checkLimit('verify', tokenDoc.email);
    if (tokenDoc.expiresCode < new Date()) throw new HttpError('Code has expired.', 410);

    const verify = await compareText(data.code, tokenDoc.code);
    if (!verify) throw new HttpError('Code does not matched.', 403);
    const user = await userRepository.updateUserByEmail(tokenDoc.email, { email_verified: true });
    if (!user) throw new HttpError('No user Found.', 404);

    await tokenRepository.deleteToken(tokenDoc._id);
    return { email: user.email, retries: limit?.retryCount };
  },
};
