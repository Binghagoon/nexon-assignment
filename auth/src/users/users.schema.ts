import { Schema } from 'mongoose';

export enum UserRole {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export const UserSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.USER,
  },
});

export interface User {
  email: string;
  username: string;
  password: string;
  salt: string;
  role: UserRole;
}

export interface UserApi extends Omit<User, 'password' | 'salt'> {
  id: string;
  password?: never;
  salt?: never;
}

export interface UserLogin extends Pick<User, 'username' | 'password'> {}
