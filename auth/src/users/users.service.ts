import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserApi, UserLogin } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  private async genPasswordAndSalt(password: string): Promise<{
    password: string;
    salt: string;
  }> {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    return { password: hashedPassword, salt };
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
    const conflictUsers = await this.userModel.find({ username }).exec();
    if (conflictUsers.length !== 0)
      throw new ConflictException('Username is conflict, use another username');
    const { password: hashedPassword, salt } = await this.genPasswordAndSalt(
      password
    );
    const user = new this.userModel({
      email,
      username,
      salt,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    return this.toUserApi(createdUser);
  }

  async validateUser({ password, username }: UserLogin): Promise<UserApi> {
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
  async findById(id: string): Promise<UserApi> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return this.toUserApi(user);
  }

  async updateById(
    id: string,
    { email, password, role }: UpdateUserDto
  ): Promise<UserApi> {
    const { password: hashedPassword, salt } = password
      ? await this.genPasswordAndSalt(password)
      : { password: undefined, salt: undefined };
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        { email, role, password: hashedPassword, salt },
        { new: true }
      )
      .exec();
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
    return this.toUserApi(user);
  }
  async deleteById(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException(`User with id "${id}" not found`);
  }
}
