import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, Event } from '@services/events/domain/model';
import { ParticipationSchema } from '@services/participants/domain/model';
import { Participation } from '@services/participants/domain/model';
import { RewardRequest } from '@services/reward-requests/domain/model';
import { RewardRequestSchema } from '@services/reward-requests/domain/model';
import { RewardSchema, Reward } from '@services/rewards/domain/model';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DATABASE_HOST');
        const port = configService.get<number>('DATABASE_PORT');
        const user = configService.get<string>('DATABASE_USER');
        const pass = configService.get<string>('DATABASE_PASSWORD');
        const dbName = configService.get<string>('DATABASE_NAME');

        const uri = `mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=admin`;

        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: Reward.name,
        schema: RewardSchema,
      },
      {
        name: RewardRequest.name,
        schema: RewardRequestSchema,
      },
      {
        name: Participation.name,
        schema: ParticipationSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
