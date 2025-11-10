// import { userRepository } from '@/repositories/userRepository';
// import bcrypt from 'bcrypt';

// export const userService = {
//   /**
//    * Create a new user in the system.
//    *
//    * Steps:
//    *  1. Check if the email already exists (business rule).
//    *  2. Hash the password.
//    *  3. Call the repository to persist the user in the DB.
//    *  4. Return the created user object.
//    *
//    * @param data - Object containing name, email, password
//    * @returns The created user object
//    * @throws Error if email already exists
//    */
//   createNode: async ({
//     name,
//     email,
//     password,
//   }: {
//     name: string;
//     email: string;
//     password: string;
//   }) => {
//     // Check business rule: email uniqueness
//     const existing = await userRepository.findByEmail(email);
//     if (existing) throw new Error('Email already exists');

//     // Hash password (transformation)
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Persist user in DB via repository
//     return userRepository.create({ name, email, password: hashedPassword });
//   },

//   /**
//    * Find a user by email.
//    *
//    * @param email - User email
//    * @returns User object if found, otherwise null
//    */
//   findUserByEmail: async (email: string) => {
//     return userRepository.findByEmail(email);
//   },
// };
