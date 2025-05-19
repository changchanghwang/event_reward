import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@libs/exceptions';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { logLevel } from 'kafkajs';

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
        clientId: 'event-server-consumer-v3',
        brokers: [configService.get<string>('KAFKA_BROKER_URL')],
        logLevel: logLevel.DEBUG,
      },
      consumer: {
        groupId: 'event-consumer-v3',
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
