import User, { IUser } from '@/models/user';

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
  create: (data: IUser) => new User(data).save(),

  /**
   * Update a user by ID.
   * @param id - User ID
   * @param data - Data to update
   * @returns Updated user document
   */
  updateById: (id: string, data: IUser) => User.findByIdAndUpdate(id, data, { new: true }),
};
