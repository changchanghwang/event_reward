import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../application/service';
import { RegisterCommand } from '../commands/register';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async register(@Body() registerCommand: RegisterCommand) {
    return this.usersService.register(registerCommand);
  }
}
