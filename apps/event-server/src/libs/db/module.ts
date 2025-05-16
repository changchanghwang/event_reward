import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, Event } from '@services/events/domain/model';
import { RewardSchema, Reward } from '@services/rewards/domain/model';

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
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
