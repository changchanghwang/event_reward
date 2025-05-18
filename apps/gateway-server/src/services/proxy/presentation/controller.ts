import {
  Controller,
  Req,
  Res,
  Post,
  HttpException,
  Patch,
  UseGuards,
  All,
  Get,
  Inject,
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
    @Inject('REQUEST_ID') private readonly requestId: string,
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
        'x-request-id': this.requestId,
        host: new URL(serviceUrl).host,
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.request(requestConfig),
      );
      res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
      throw new HttpException(
        error.response?.data ?? error.message,
        error.response?.status || 500,
      );
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

  @All(['/events', '/events/*'])
  @Roles(Role.OPERATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async proxyPrivateEventRoutes(@Req() req: Request, @Res() res: Response) {
    return await this.proxyRequest(this.eventServerUrl, req, res);
  }

  @Post('/rewards')
  @Roles(Role.OPERATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async proxyPrivateRewardRegisterRoutes(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.proxyRequest(this.eventServerUrl, req, res);
  }

  @Get('/rewards')
  @Roles(Role.OPERATOR, Role.AUDITOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async proxyPrivateRewardListRoutes(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.proxyRequest(this.eventServerUrl, req, res);
  }

  @Post('/reward-requests')
  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async proxyPrivateRewardRequestRegisterRoutes(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.proxyRequest(this.eventServerUrl, req, res);
  }

  @Post(['/reward-requests/:id/approve', '/reward-requests/:id/reject'])
  @Roles(Role.OPERATOR)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async proxyPrivateRewardRequestApproveRoutes(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.proxyRequest(this.eventServerUrl, req, res);
  }
}
