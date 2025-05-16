import { Body, Controller, Post } from '@nestjs/common';
import { RewardService } from '@services/rewards/application/service';
import { RegisterCommand } from '@services/rewards/commands/register';

@Controller('/rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  async register(@Body() registerCommand: RegisterCommand) {
    return this.rewardService.register(registerCommand);
  }
}
