import type { User } from '../domain/model';

export interface UserRepository {
  save(users: User[]): Promise<void>;
  findOneByEmail(email: string): Promise<User | null>;
}
