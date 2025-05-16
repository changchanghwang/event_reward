import { Body, Controller, Post } from '@nestjs/common';
import { RegisterCommand } from '@services/reward-requests/commands';
import { RewardRequestService } from '@services/reward-requests/application/service';

@Controller('/reward-requests')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  async register(@Body() registerCommand: RegisterCommand) {
    return this.rewardRequestService.register(registerCommand);
  }
}
