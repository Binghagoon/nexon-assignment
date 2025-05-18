import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  private toUserApi({
    email,
    role,
    username,
    _id,
  }: User & { _id: Types.ObjectId }): UserApi {
    return {
      id: _id.toString(),
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

  async login({ password, username }: UserLogin): Promise<UserApi> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) throw new NotFoundException('User not found');
    const isPasswordCorrect = await this.checkIsPasswordCorrect(password, user);
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Password Incorrect');
    return this.toUserApi(user);
  }
  async findAll(): Promise<UserApi[]> {
    const users = await this.userModel.find();
    return users.map(this.toUserApi);
  }
}
