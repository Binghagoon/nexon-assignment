import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ProxyService } from 'src/proxy.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Req() { body, headers, query, originalUrl }: Request,
    @Res() res: Response,
  ) {
    const authServiceUrl = this.configService.get('AUTH_SERVICE_URL');
    const targetUrl = `${authServiceUrl}${originalUrl}`;
    const data = await this.proxyService.proxyRequest({
      body,
      headers,
      query,
      method: 'POST',
      targetUrl,
    });
    return res.json(data);
  }
}
