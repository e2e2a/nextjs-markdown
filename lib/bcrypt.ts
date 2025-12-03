import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text.
 * @param text - The plain text to hash.
 * @returns The hashed text.
 */
export function hashText(text: string): Promise<string> {
  const hashedPassword = bcrypt.hash(text, SALT_ROUNDS);
  return hashedPassword;
}

/**
 * Compare a plain text text with a hashed text.
 * @param plainText - The plain text text.
 * @param hashedText - The hashed text.
 * @returns True if the text match, otherwise false.
 */
export async function compareText(plainText: string, hashedText: string): Promise<boolean> {
  const isMatch = bcrypt.compare(plainText, hashedText);
  return isMatch;
}
