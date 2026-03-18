import type { IUserDocument } from '../models/User';

declare global {
  namespace Express {
    // Augment Passport's Express.User interface so req.user is typed as
    // IUserDocument throughout the entire application.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends IUserDocument {}
  }
}

export {};
