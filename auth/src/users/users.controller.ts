import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserApi } from './users.schema';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

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
  async findAll(): Promise<UserApi[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserApi> {
    return this.userService.findById(id);
  }
  @Patch(':id')
  async updateById(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto
  ): Promise<UserApi> {
    return this.userService.updateById(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(@Param('id') id: string) {
    await this.userService.deleteById(id);
  }
}
