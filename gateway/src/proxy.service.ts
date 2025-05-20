// proxy.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(private readonly httpService: HttpService) {}

  async proxyRequest({
    body,
    headers,
    method,
    query,
    targetUrl,
  }: {
    body: any;
    headers: any;
    method: string;
    query: any;
    targetUrl: string;
  }) {
    const response$ = this.httpService.request({
      method,
      url: targetUrl,
      data: body,
      headers,
      params: query,
    });
    const response = await lastValueFrom(response$);
    return response.data;
  }
}
