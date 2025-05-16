import { Module } from '@nestjs/common';
import { EventRepositoryImpl } from './infrastructure/repository-impl';
import { EventController } from './presentation/controller';
import { EventService } from './application';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [
    EventService,
    {
      provide: 'EventRepository',
      useClass: EventRepositoryImpl,
    },
  ],
  exports: ['EventRepository'],
})
export class EventsModule {}
