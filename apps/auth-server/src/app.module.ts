import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@services/users/module';
import { HealthModule } from '@libs/health';
import { DatabaseModule } from '@libs/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
