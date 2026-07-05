import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Requires a valid JWT. Delegates to the passport 'jwt' strategy,
// which verifies the token and populates request.user.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
