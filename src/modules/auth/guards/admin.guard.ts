import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserRole } from '../../users/schema/user.schema';
import { AuthUser } from '../types/jwt-payload.type';

// Requires a valid JWT AND an admin role.
@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Run the JWT strategy first (authenticates + populates request.user).
    await super.canActivate(context);

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthUser }>();

    if (request.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
