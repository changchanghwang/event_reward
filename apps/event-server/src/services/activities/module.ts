import { Module } from '@nestjs/common';
import { ActivityRepositoryImpl } from './infrastructure/repository-impl';
import { LoginActivityService } from './application';
import { ActivityController } from './presentation/controller';
import { EventsModule } from '@services/events/module';
import { ActivityGenerator } from '@services/activities/domain/services';

@Module({
  imports: [EventsModule],
  controllers: [ActivityController],
  providers: [
    LoginActivityService,
    {
      provide: 'ActivityRepository',
      useClass: ActivityRepositoryImpl,
    },
    ActivityGenerator,
  ],
  exports: [],
})
export class ActivitiesModule {}
