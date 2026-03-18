import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import type { IStrategyOptions, IVerifyOptions } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import type { IUserDocument } from '@/models/User';

// ─── Types ────────────────────────────────────────────────────────────────────

type LocalStrategyDoneCallback = (
  error: Error | null,
  user: IUserDocument | false,
  options: IVerifyOptions | undefined
) => void;

// Matches: 9876543210 | +919876543210 | 09876543210
const MOBILE_REGEX = /^(\+91|0)?[6-9]\d{9}$/;

// ─── configurePassport ────────────────────────────────────────────────────────

export function configurePassport(): void {
  const options: IStrategyOptions = {
    usernameField: 'identifier',
    passwordField: 'pin',
    passReqToCallback: false,
    session: false,
  };

  const verifyCallback = async function (
    identifier: string,
    pin: string,
    done: LocalStrategyDoneCallback
  ): Promise<void> {
    try {
      const user: IUserDocument | null = await User.findByIdentifier(identifier);

      if (!user) {
        done(
          null,
          false,
          {
            message:
              'No account found with this email or mobile number — यह email या mobile number registered नहीं है',
          }
        );
        return;
      }

      const isMatch: boolean = await user.comparePin(pin);

      if (!isMatch) {
        done(null, false, { message: 'Incorrect PIN — गलत PIN दर्ज किया' });
        return;
      }

      done(null, user, undefined);
    } catch (err) {
      done(err as Error, false, undefined);
    }
  };

  passport.use(new LocalStrategy(options, verifyCallback));
}

// ─── registerUser ─────────────────────────────────────────────────────────────

interface RegisterUserParams {
  name: string;
  identifier: string;
  pin: string;
  role?: 'student' | 'admin';
}

export async function registerUser(params: RegisterUserParams): Promise<IUserDocument> {
  const { name, identifier, pin, role = 'student' } = params;

  // Validate PIN — digits only, 4–6 characters
  if (!/^\d{4,6}$/.test(pin)) {
    throw new Error('PIN must be 4 to 6 digits — PIN 4 से 6 अंकों का होना चाहिए');
  }

  // Check for duplicate identifier
  const existing: IUserDocument | null = await User.findByIdentifier(identifier);
  if (existing) {
    throw new Error(
      'An account already exists with this email or mobile number — यह email या mobile number पहले से registered है'
    );
  }

  // Hash the PIN — raw PIN never leaves this scope
  const passwordHash: string = await bcrypt.hash(pin, 12);

  const isMobile: boolean = MOBILE_REGEX.test(identifier.trim());

  const userData = isMobile
    ? { name, mobileNumber: identifier.trim(), passwordHash, role, authProvider: 'local' as const }
    : { name, email: identifier.trim().toLowerCase(), passwordHash, role, authProvider: 'local' as const };

  const created: IUserDocument = await User.create(userData);
  return created;
}

export default configurePassport;
