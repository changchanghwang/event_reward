import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@libs/health';
import { DatabaseModule } from '@libs/db';
import { EventsModule } from '@services/events/module';
import { RewardsModule } from '@services/rewards/module';
import { RewardRequestsModule } from '@services/reward-requests/module';
import { ActivitiesModule } from '@services/activities/module';
import { KafkaClientModule } from '@libs/kafka';
import { RequestIdModule } from '@libs/request';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,
    EventsModule,
    RewardsModule,
    RewardRequestsModule,
    ActivitiesModule,
    RequestIdModule,
    KafkaClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
