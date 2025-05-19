import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

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

  @Post('verify')
  async verify(@Body() body: { accessToken?: string }) {
    const { accessToken } = body ?? {};
    if (!accessToken) throw new UnauthorizedException('Token not provided');

    const user = await this.authService.verifyToken(accessToken);
    return { user };
  }
}
