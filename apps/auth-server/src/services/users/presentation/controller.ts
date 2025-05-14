import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../application/service';
import { RegisterCommand, LoginCommand } from '../commands';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async register(@Body() registerCommand: RegisterCommand) {
    return this.usersService.register(registerCommand);
  }

  @Post('/login')
  async login(@Body() loginCommand: LoginCommand) {
    return this.usersService.login(loginCommand);
  }
}
