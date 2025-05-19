import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

export { EventHandler } from './handler';

export const AUTH_SERVER_EVENT_TOPIC = 'auth-server-ddd-event';
export const EVENT_SERVER_EVENT_TOPIC = 'event-server-ddd-event';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'event-server-producer',
              brokers: [configService.get<string>('KAFKA_BROKER_URL')],
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner,
            },
            consumer: {
              groupId: 'event-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [],
  exports: [ClientsModule],
})
export class KafkaClientModule {}
