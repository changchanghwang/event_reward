import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@libs/health';
import { DatabaseModule } from '@libs/db';
import { EventsModule } from '@services/events/module';
import { RewardsModule } from '@services/rewards/module';
import { RewardRequestsModule } from '@services/reward-requests/module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    EventsModule,
    RewardsModule,
    RewardRequestsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
