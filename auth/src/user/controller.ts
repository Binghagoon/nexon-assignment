import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get()
  findAll() {
    throw new HttpException('Not Implemented', HttpStatus.NOT_IMPLEMENTED);
  }
}
