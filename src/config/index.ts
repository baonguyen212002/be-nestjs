import adminConfig from './admin.config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import mailConfig from './mail.config';

// Pass this array to ConfigModule.forRoot({ load: configurations }).
export const configurations = [
  appConfig,
  databaseConfig,
  jwtConfig,
  mailConfig,
  adminConfig,
];
