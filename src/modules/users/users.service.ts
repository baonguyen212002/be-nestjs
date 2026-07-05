import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  findByVerificationTokenHash(hash: string): Promise<User | null> {
    return this.userModel.findOne({ verificationTokenHash: hash }).exec();
  }

  findByResetTokenHash(hash: string): Promise<User | null> {
    return this.userModel.findOne({ resetTokenHash: hash }).exec();
  }

  create(data: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    isVerified?: boolean;
  }): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }
}
