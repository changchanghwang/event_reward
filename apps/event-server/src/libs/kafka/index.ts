import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

export { EventHandler } from './handler';

export const AUTH_SERVER_EVENT_TOPIC = 'auth-server-ddd-event';

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
              clientId: 'event-server',
              brokers: [configService.get<string>('KAFKA_BROKER_URL')],
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
