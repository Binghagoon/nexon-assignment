import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(username: string, password: string) {
    const { id, role } = await this.userService.login({ password, username });
    const payload = { sub: id, username, role };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: { id, username, role },
    };
  }
}
