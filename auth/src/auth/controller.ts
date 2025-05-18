import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { password: string; username: string }) {
    const { password, username } = body;
    const { accessToken, user } = await this.authService.login(
      username,
      password
    );
    return {
      accessToken,
      user,
    };
  }
}
