import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
              clientId: 'auth-server',
              brokers: [configService.get<string>('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: 'auth-consumer',
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
