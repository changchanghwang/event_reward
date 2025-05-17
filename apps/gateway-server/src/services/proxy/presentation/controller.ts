import {
  Controller,
  Req,
  Res,
  Post,
  HttpException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import type { AxiosRequestConfig } from 'axios';
import { JwtAuthGuard, Public, Role, Roles, RolesGuard } from '@libs/guards';
import { JwtPayload } from '@libs/jwt';

@Controller()
export class ProxyController {
  private authServerUrl: string;
  private eventServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServerUrl = this.configService.get<string>('AUTH_SERVER_URL');
    this.eventServerUrl = this.configService.get<string>('EVENT_SERVER_URL');
  }

  private async proxyRequest(
    targetUrl: string,
    req: Request,
    res: Response,
    user?: JwtPayload,
  ) {
    const { method, originalUrl, body, headers } = req;
    const serviceUrl = `${targetUrl}${originalUrl}`;

    const newHeaders = { ...headers };
    delete newHeaders['content-length'];
    delete newHeaders['transfer-encoding'];

    const requestConfig: AxiosRequestConfig = {
      method,
      url: serviceUrl,
      data: body,
      headers: {
        ...newHeaders,
        'x-user-id': user?.userId,
        'x-user-role': user?.role,
        host: new URL(serviceUrl).host,
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.request(requestConfig),
      );
      res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  @Public()
  @Post(['/users/login', '/users'])
  async proxyPublicUserRoutes(@Req() req: Request, @Res() res: Response) {
    return await this.proxyRequest(this.authServerUrl, req, res);
  }

  @Patch('/users/:id/roles')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async proxyPrivateUserRoutes(@Req() req: Request, @Res() res: Response) {
    return await this.proxyRequest(this.authServerUrl, req, res);
  }
}
