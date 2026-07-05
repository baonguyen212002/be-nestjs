import { registerAs } from '@nestjs/config';

// Accessed as config.get('app.*') — e.g. config.get('app.frontendUrl')
export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  url: process.env.APP_URL ?? 'http://localhost:3000',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:4200',
}));
