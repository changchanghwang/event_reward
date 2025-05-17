import { Module } from '@nestjs/common';
import { AuthModule } from '@libs/auth/module';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './presentation/controller';

@Module({
  imports: [
    AuthModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ProxyController],
})
export class ProxyModule {}
