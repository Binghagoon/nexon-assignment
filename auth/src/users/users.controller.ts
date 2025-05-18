import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserApi } from './users.schema';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto
  ): Promise<UserApi> {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<UserApi[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<UserApi> {
    return this.userService.findById(id);
  }
}
