import { Schema } from 'mongoose';

export enum UserType {
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
    enum: Object.values(UserType),
    required: true,
    default: UserType.USER,
  },
});

export interface User {
  email: string;
  username: string;
  password: string;
  salt: string;
  role: UserType;
}

export interface UserApi extends Omit<User, 'password' | 'salt'> {}

export interface UserLogin extends Pick<User, 'username' | 'password'> {}
