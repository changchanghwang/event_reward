import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../infrastructure/repository';
import { User } from '../domain/model';
import { PasswordHashService } from '../domain/services';
import { RegisterCommand, LoginCommand, ChangeRoleCommand } from '../commands';
import { unauthorized } from '@libs/exceptions';
@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly passwordHashService: PasswordHashService,
    private readonly jwtService: JwtService,
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

  async login(loginCommand: LoginCommand) {
    const user = await this.userRepository.findOneByEmail(loginCommand.email);

    if (!user) {
      throw unauthorized('User not found.', {
        errorMessage: '이메일 또는 비밀번호가 일치하지 않습니다.',
      });
    }

    await user.validatePassword(
      loginCommand.password,
      this.passwordHashService,
    );

    return user.login(this.jwtService);
  }

  async changeRole(userId: string, changeRoleCommand: ChangeRoleCommand) {
    const user = await this.userRepository.findOneOrFail(userId);

    user.changeRole(changeRoleCommand.role);

    await this.userRepository.save([user]);

    return user;
  }
}
