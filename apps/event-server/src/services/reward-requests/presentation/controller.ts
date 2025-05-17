import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ListCommand,
  RegisterCommand,
} from '@services/reward-requests/commands';
import { RewardRequestService } from '@services/reward-requests/application/service';

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
  async list(@Query() listCommand: ListCommand) {
    return this.rewardRequestService.list(listCommand);
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
