import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    MailModule,
    PassportModule,
    // JwtModule is still used to SIGN tokens in AuthService.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('jwt.accessSecret'),
        signOptions: {
          // `ms` typing expects a template-literal string; cast the env value.
          expiresIn: (config.get<string>('jwt.accessExpiresIn') ??
            '15m') as `${number}m`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  // JwtStrategy registers the passport 'jwt' strategy used by the guards.
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
