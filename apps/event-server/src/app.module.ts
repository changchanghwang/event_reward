import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '@libs/health';
import { DatabaseModule } from '@libs/db';
import { EventsModule } from '@services/events/modeul';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HealthModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
