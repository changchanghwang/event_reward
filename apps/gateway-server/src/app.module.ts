import { HealthModule } from '@libs/health';
import { RequestIdModule } from '@libs/request';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from '@services/proxy/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    ProxyModule,
    RequestIdModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
