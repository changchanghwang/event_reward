// nest schedule의 경우 내부적으로 crypto를 사용하고 있는데
// Node 18의 경우 crypto 모듈이 없어서 추가해줘야 함
// <--
import { webcrypto } from 'node:crypto';
(global as any).crypto = webcrypto;
// --> node version을 업그레이드 하면 필요없어진다.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@libs/exceptions';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  const whitelist = [configService.get<string>('GATEWAY_SERVER_URL')];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'event-server-consumer',
        brokers: [configService.get<string>('KAFKA_BROKER_URL')],
      },
      consumer: {
        groupId: 'event-server-consumer',
        allowAutoTopicCreation: false,
      },
    },
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
