import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './services/users/module';
import { HealthModule } from '@libs/health';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DATABASE_HOST');
        const port = configService.get<number>('DATABASE_PORT');
        const user = configService.get<string>('DATABASE_USER');
        const pass = configService.get<string>('DATABASE_PASSWORD');
        const dbName = configService.get<string>('DATABASE_NAME');

        const uri = `mongodb://${user}:${pass}@${host}:${port}/${dbName}?authSource=admin`;

        console.log('Connecting to MongoDB URI:', uri.replace(pass, '*****'));

        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
