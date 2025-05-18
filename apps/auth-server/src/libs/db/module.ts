import { DddEventSchema } from '@libs/ddd/event';
import { DddEvent } from '@libs/ddd/event';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@services/users/domain/model';

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
      { name: User.name, schema: UserSchema },
      { name: DddEvent.name, schema: DddEventSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
