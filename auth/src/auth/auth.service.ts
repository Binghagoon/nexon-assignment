import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async login(username: string, password: string) {
    const { id, role } = await this.userService.validateUser({
      password,
      username,
    });
    const payload = { sub: id, username, role };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: { id, username, role },
    };
  }

  private async decodeToken(token: string) {
    try {
      const value: {
        exp: number;
        iat: number;
        role: string;
        sub: string;
        username: string;
      } = await this.jwtService.verifyAsync(token);
      return value;
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw new UnauthorizedException('Token expired');
      else if (error.name === 'JsonWebTokenError')
        throw new UnauthorizedException('Invalid token');
      else throw new BadRequestException('Token verification failed');
    }
  }
  async verifyToken(token: string) {
    const payload = await this.decodeToken(token);
    const user = await this.userService.findById(payload.sub);
    return user;
  }
}
