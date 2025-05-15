import { Module } from '@nestjs/common';
import { EventRepositoryImpl } from './infrastructure/repository-impl';
import { EventController } from './presentation/controller';
import { EventService } from './application';
import { DatabaseModule } from '@libs/db/module';

@Module({
  imports: [DatabaseModule],
  controllers: [EventController],
  providers: [
    EventService,
    {
      provide: 'EventRepository',
      useClass: EventRepositoryImpl,
    },
  ],
})
export class EventsModule {}
