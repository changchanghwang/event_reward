import { HealthModule } from '@libs/health';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
