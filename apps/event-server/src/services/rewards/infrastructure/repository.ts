import type { Reward } from '../domain/model';

export type FindCondition = {
  eventId?: string;
};

export interface RewardRepository {
  save(rewards: Reward[]): Promise<void>;
  find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<Reward[]>;
  count(conditions: FindCondition): Promise<number>;
}
