import { Injectable, Inject } from '@nestjs/common';
import { SignUpCommand } from '../commands/sign-up';
import { UserRepository } from '../infrastructure/repository';
import { User } from '../domain/model';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async signUp(signUpCommand: SignUpCommand): Promise<User> {
    const user = await User.from({
      username: signUpCommand.username,
      email: signUpCommand.email,
      password: signUpCommand.password,
    });

    await this.userRepository.save([user]);

    return user;
  }
}
