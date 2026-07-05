import { registerAs } from '@nestjs/config';

// Accessed as config.get('jwt.*') — e.g. config.getOrThrow('jwt.accessSecret')
export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  refreshRememberExpiresIn:
    process.env.JWT_REFRESH_REMEMBER_EXPIRES_IN ?? '30d',
}));
