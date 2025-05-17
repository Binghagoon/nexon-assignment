import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserApi } from './schema';
import { UserService } from './service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserApi> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    throw new HttpException('Not Implemented', HttpStatus.NOT_IMPLEMENTED);
  }
}
