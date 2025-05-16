import type {
  RewardRequest,
  RewardRequestStatus,
} from '@services/reward-requests/domain/model';

export type FindCondition = {
  eventId?: string;
  userId?: string;
  rewardId?: string;
  status?: RewardRequestStatus;
};

export interface RewardRequestRepository {
  save(rewards: RewardRequest[]): Promise<void>;
  find(
    conditions: FindCondition,
    options?: { limit: number; page: number },
  ): Promise<RewardRequest[]>;
  count(conditions: FindCondition): Promise<number>;
  findOneOrFail(id: string): Promise<RewardRequest>;
}
