import { compareText, hashText } from '@/lib/bcrypt';
import { HttpError } from '@/lib/error';
import { loginSchema } from '@/lib/validators/login';
import { validateRegisterSchema } from '@/lib/validators/register';
import { userRepository } from '@/repositories/user';
import { AuthUser } from '@/types';
import { tokenService } from './token';
import nodemailer from 'nodemailer';
import { verificationTemplate } from '@/components/email-template/verification-code';
import { rateLimitService } from './rateLimit';

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
  login: async (data: AuthUser) => {
    const result = loginSchema.safeParse(data);
    if (!result.success) throw new HttpError('Invalid fields.', 400);

    await rateLimitService.checkLimit(data.authType, data.email);

    const user = await userRepository.findUserBy({ email: result.data.email }, false);
    if (!user) throw new HttpError('Email has not been yet registered.', 409);
    if (!user.password) throw new HttpError('Account is linked to another provider.', 409);

    const verify = await compareText(result.data.password, user.password);
    if (!verify) throw new HttpError('Invalid Credentials.', 409);

    return user;
  },

  register: async (data: AuthUser) => {
    const result = validateRegisterSchema.safeParse(data);
    if (!result.success) throw new HttpError('Invalid fields.', 400);
    let user = null;
    user = await userRepository.findUserBy({ email: result.data.email }, false);
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

    await rateLimitService.checkLimit(data.authType, data.email); // set rateLimit for register

    const token = await tokenService.generateToken(user.email, 'EmailVerification');
    sendEmail(user.email, 'Verification Code', token.type, token.code);
    return { email: data.email, token: token.token };
  },
};
