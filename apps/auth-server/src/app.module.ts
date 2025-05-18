import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@services/users/module';
import { HealthModule } from '@libs/health';
import { DatabaseModule } from '@libs/db';
import { RequestIdModule } from '@libs/request';
import { KafkaClientModule } from '@libs/kafka';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    HealthModule,
    RequestIdModule,
    KafkaClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
