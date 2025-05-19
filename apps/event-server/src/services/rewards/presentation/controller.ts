import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RewardService } from '@services/rewards/application/service';
import { ListCommand } from '@services/rewards/commands';
import { RegisterCommand } from '@services/rewards/commands/register';

@Controller('/rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  async register(@Body() registerCommand: RegisterCommand) {
    return this.rewardService.register(registerCommand);
  }

  @Get()
  async list(@Query() listCommand: ListCommand) {
    return this.rewardService.list(listCommand);
  }
}
