import { EVENT_SERVER_EVENT_TOPIC, EventHandler } from '@libs/kafka';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ActivityRegisteredEvent } from '@services/activities/domain/events';
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

  @EventHandler(ActivityRegisteredEvent, {
    topic: EVENT_SERVER_EVENT_TOPIC,
  })
  async onActivityRegistered(event: ActivityRegisteredEvent) {
    console.log('!!!', event);
  }
}
