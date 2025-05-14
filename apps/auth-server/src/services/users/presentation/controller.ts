import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../application/service';
import { SignUpCommand } from '../commands/sign-up';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sign-up')
  async signUp(@Body() signUpCommand: SignUpCommand) {
    return this.usersService.signUp(signUpCommand);
  }
}
