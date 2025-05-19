import type { Activity } from '../domain/model';

export type FindCondition = {
  eventIds?: string[];
  userId?: string;
  participatedOnStart?: Date;
  participatedOnEnd?: Date;
};

export interface ActivityRepository {
  save(activities: Activity[]): Promise<void>;
  find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<Activity[]>;
  count(conditions: FindCondition): Promise<number>;
  findOneOrFail(id: Activity['id']): Promise<Activity>;
}
