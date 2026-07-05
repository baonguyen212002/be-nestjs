import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// A stored (hashed) refresh token = one active session/device.
@Schema({ _id: false })
export class RefreshTokenEntry {
  @Prop({ required: true })
  tokenHash!: string;

  @Prop({ required: true })
  expiresAt!: Date;
}
export const RefreshTokenEntrySchema =
  SchemaFactory.createForClass(RefreshTokenEntry);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Prop({ default: false })
  isVerified!: boolean;

  // Active refresh tokens (hashed), one per logged-in device.
  @Prop({ type: [RefreshTokenEntrySchema], default: [] })
  refreshTokens!: RefreshTokenEntry[];

  // Email verification (SHA-256 hash of the emailed token).
  @Prop()
  verificationTokenHash?: string;

  @Prop()
  verificationTokenExpires?: Date;

  // Password reset (SHA-256 hash of the emailed token).
  @Prop()
  resetTokenHash?: string;

  @Prop()
  resetTokenExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
