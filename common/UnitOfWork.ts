// common/UnitOfWork.ts
import mongoose, { ClientSession } from 'mongoose';
import { AsyncLocalStorage } from 'async_hooks';

const storage = new AsyncLocalStorage<ClientSession>();

export class UnitOfWork {
  static async run<T>(work: () => Promise<T>): Promise<T> {
    const existingSession = storage.getStore();

    // 1. PROPAGATION: If we are already in a transaction, just run the work
    if (existingSession) return await work();

    // 2. ENTRY POINT: If no session exists, we are the "Owner" of the transaction
    const session = await mongoose.startSession();

    return await storage.run(session, async () => {
      session.startTransaction();
      try {
        const result = await work();
        await session.commitTransaction();
        return result;
      } catch (error) {
        // Only the owner of the session can abort
        if (session.inTransaction()) {
          await session.abortTransaction();
        }
        throw error;
      } finally {
        // Only the owner of the session can end it
        await session.endSession();
      }
    });
  }

  static getSession(): ClientSession | undefined {
    return storage.getStore();
  }
}
