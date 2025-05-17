import { Module } from '@nestjs/common';
import { UserController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './service';
import { UserSchema } from './schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
