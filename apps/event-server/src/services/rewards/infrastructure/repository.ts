import type { Reward } from '../domain/model';

export interface RewardRepository {
  save(rewards: Reward[]): Promise<void>;
}
