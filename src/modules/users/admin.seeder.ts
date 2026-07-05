import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../../common/security.constants';
import { UserRole } from './schema/user.schema';
import { UsersService } from './users.service';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const email = this.config.get<string>('admin.email') ?? 'admin@shop.com';
    const password = this.config.get<string>('admin.password') ?? 'admin123';
    const name = this.config.get<string>('admin.name') ?? 'Administrator';

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      this.logger.log(`Admin account already exists: ${email}`);
      return;
    }

    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await this.usersService.create({
      email,
      password: hashed,
      name,
      role: UserRole.ADMIN,
      isVerified: true,
    });

    this.logger.log(`Seeded admin account: ${email} (password: ${password})`);
  }
}
