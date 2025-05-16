import type { RewardRequest } from '../domain/model';

export type FindCondition = {
  eventId?: string;
  userId?: string;
  rewardId?: string;
};

export interface RewardRequestRepository {
  save(rewards: RewardRequest[]): Promise<void>;
  find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<RewardRequest[]>;
}
