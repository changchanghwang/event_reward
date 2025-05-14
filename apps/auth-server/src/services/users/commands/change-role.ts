import { Role } from '@services/users/domain/model';
import { IsEnum } from 'class-validator';

export class ChangeRoleCommand {
  @IsEnum(Role)
  role: Role;
}
