/**
 * @file services/userService.ts
 * @description
 * This is the **Service layer** (business logic layer).
 *
 * Responsibilities:
 *  - Contains all business rules and logic for users.
 *  - Calls repository/model methods to query or update the database.
 *  - Performs transformations like hashing passwords.
 *  - Validates business conditions (e.g., email uniqueness).
 *
 * Folder: `services/`
 * Do not handle HTTP requests or responses here.
 * Only return structured data to be used by controllers/actions.
 */

import { userRepository } from '@/repositories/userRepository';
import bcrypt from 'bcrypt';

export const userService = {
  /**
   * Create a new user in the system.
   *
   * Steps:
   *  1. Check if the email already exists (business rule).
   *  2. Hash the password.
   *  3. Call the repository to persist the user in the DB.
   *  4. Return the created user object.
   *
   * @param data - Object containing name, email, password
   * @returns The created user object
   * @throws Error if email already exists
   */
  createNode: async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    // Check business rule: email uniqueness
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('Email already exists');

    // Hash password (transformation)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Persist user in DB via repository
    return userRepository.create({ name, email, password: hashedPassword });
  },

  /**
   * Find a user by email.
   *
   * @param email - User email
   * @returns User object if found, otherwise null
   */
  findUserByEmail: async (email: string) => {
    return userRepository.findByEmail(email);
  },
};
