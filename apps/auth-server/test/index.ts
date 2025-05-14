import { Role, User } from '@services/users/domain/model';
import { plainToInstance } from 'class-transformer';

export function userOf({
  id,
  username,
  email,
  password,
  role,
}: {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
}) {
  return plainToInstance(User, {
    id: id ?? 'test-id',
    username: username ?? 'test-username',
    email: email ?? 'test-email',
    password: password ?? 'test-password',
    role: role ?? Role.USER,
  });
}
