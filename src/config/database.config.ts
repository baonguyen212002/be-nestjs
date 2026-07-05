import { registerAs } from '@nestjs/config';

// Accessed as config.get('database.uri')
export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
}));
