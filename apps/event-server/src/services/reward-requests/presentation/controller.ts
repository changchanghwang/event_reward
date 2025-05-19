import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ListCommand,
  RegisterCommand,
} from '@services/reward-requests/commands';
import { RewardRequestService } from '@services/reward-requests/application/service';
import { UserRole } from '@services/external/domain/type';

@Controller('/reward-requests')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  @HttpCode(201)
  async register(@Body() registerCommand: RegisterCommand) {
    return this.rewardRequestService.register(registerCommand);
  }

  @Get()
  @HttpCode(200)
  async list(@Query() listCommand: ListCommand, @Req() req: Request) {
    const user = {
      id: req.headers['x-user-id'] as string,
      role: req.headers['x-user-role'] as UserRole,
    };
    return this.rewardRequestService.list(listCommand, user);
  }

  @Post(':id/approve')
  @HttpCode(200)
  async approve(@Param('id') id: string) {
    return this.rewardRequestService.approve({ id });
  }

  @Post(':id/reject')
  @HttpCode(200)
  async reject(@Param('id') id: string) {
    return this.rewardRequestService.reject({ id });
  }
}
