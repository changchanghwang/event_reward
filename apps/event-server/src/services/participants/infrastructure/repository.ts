import type { Participation } from '../domain/model';

export type FindCondition = {
  eventId?: string;
  userId?: string;
  participatedAtStart?: Date;
  participatedAtEnd?: Date;
};

export interface ParticipationRepository {
  save(participations: Participation[]): Promise<void>;
  find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<Participation[]>;
  count(conditions: FindCondition): Promise<number>;
  findOneOrFail(id: Participation['id']): Promise<Participation>;
}
