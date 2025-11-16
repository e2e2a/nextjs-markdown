import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET must be defined in .env');

/**
 * Generate a token for a MembershipInvite
 * @param _id - the _id of the MembershipInvite
 */
export function generateInviteToken(_id: string) {
  const payload = { _id };

  const options: SignOptions = {
    expiresIn: 7 * 24 * 60 * 60,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}
