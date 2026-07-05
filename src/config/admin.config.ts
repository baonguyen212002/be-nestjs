import { registerAs } from '@nestjs/config';

// Seeded admin account — accessed as config.get('admin.*')
export default registerAs('admin', () => ({
  email: process.env.ADMIN_EMAIL ?? 'admin@shop.com',
  password: process.env.ADMIN_PASSWORD ?? 'admin123',
  name: process.env.ADMIN_NAME ?? 'Administrator',
}));
