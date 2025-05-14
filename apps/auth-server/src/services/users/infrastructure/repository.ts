import type { User } from '../domain/model';

export interface UserRepository {
  save(users: User[]): Promise<void>;
}
