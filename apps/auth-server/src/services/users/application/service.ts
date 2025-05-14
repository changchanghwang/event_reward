import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../infrastructure/repository';
import { User } from '../domain/model';
import { PasswordHashService } from '../domain/services';
import { RegisterCommand } from '../commands/register';
@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async register(registerCommand: RegisterCommand): Promise<User> {
    const user = await User.from({
      username: registerCommand.username,
      email: registerCommand.email,
      password: registerCommand.password,
      passwordHashService: this.passwordHashService,
    });

    await this.userRepository.save([user]);

    return user;
  }
}
