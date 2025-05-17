import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserApi, UserLogin } from './schema';
import { CreateUserDto } from './dto/create-user.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  private async checkIsPasswordCorrect(
    password: string,
    { salt, password: savedPassword }: User
  ): Promise<boolean> {
    const hashedPassword = await hash(password, salt);
    return savedPassword === hashedPassword;
  }

  private toUserApi({ email, role, username }: User): UserApi {
    return {
      email,
      role,
      username,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserApi> {
    const { email, password, username } = createUserDto;
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const user = new this.userModel({
      email,
      username,
      salt,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    return this.toUserApi(createdUser);
  }

  async login({
    password,
    username,
  }: UserLogin): Promise<User | 'User not Found' | 'Password incorrect'> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) return 'User not Found';
    const isPasswordCorrect = await this.checkIsPasswordCorrect(password, user);
    if (!isPasswordCorrect) return 'Password incorrect';
    return user;
  }
}
