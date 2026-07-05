import { UserRole } from '../../users/schema/user.schema';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}
