import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ListCommand,
  RegisterCommand,
} from '@services/reward-requests/commands';
import { RewardRequestService } from '@services/reward-requests/application/service';

@Controller('/reward-requests')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  async register(@Body() registerCommand: RegisterCommand) {
    return this.rewardRequestService.register(registerCommand);
  }

  @Get()
  async list(@Query() listCommand: ListCommand) {
    return this.rewardRequestService.list(listCommand);
  }
}
