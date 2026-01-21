import { ErrorKey, ERRORS } from './error-map';

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(key: ErrorKey, customMessage?: string) {
    const config = ERRORS[key];
    super(customMessage || config.message);

    this.status = config.status;
    this.code = key;
    this.name = 'HttpError';

    // Important for TypeScript to recognize 'instanceof HttpError' correctly
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
