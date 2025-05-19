import { Module } from '@nestjs/common';
import { ParticipationRepositoryImpl } from './infrastructure/repository-impl';
import { LoginParticipationService } from './application';
import { ParticipationController } from './presentation/controller';

@Module({
  imports: [],
  controllers: [ParticipationController],
  providers: [
    LoginParticipationService,
    {
      provide: 'ParticipationRepository',
      useClass: ParticipationRepositoryImpl,
    },
  ],
  exports: [],
})
export class ParticipantsModule {}
