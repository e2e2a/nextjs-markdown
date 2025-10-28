/**
 * @file repositories/userRepository.ts
 * @description
 * Repository layer for User model.
 *
 * Responsibilities:
 *  - Encapsulates all direct database queries.
 *  - Does NOT contain business logic.
 *  - Provides a clean interface for services to interact with the database.
 *
 * Folder: `repositories/`
 * Called by services only.
 */

import { User } from '@/models/User';

export const userRepository = {
  /**
   * Find a user by email.
   * @param email - User email
   * @returns User document if found, otherwise null
   */
  findByEmail: (email: string) => User.findOne({ email }),

  /**
   * Create a new user document in the database.
   * @param data - User data object
   * @returns Newly created user document
   */
  create: (data: any) => new User(data).save(),

  /**
   * Update a user by ID.
   * @param id - User ID
   * @param data - Data to update
   * @returns Updated user document
   */
  updateById: (id: string, data: any) => User.findByIdAndUpdate(id, data, { new: true }),
};
