import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Patch,
  Param,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../application/service';
import { RegisterCommand, LoginCommand, ChangeRoleCommand } from '../commands';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @HttpCode(201)
  async register(@Body() registerCommand: RegisterCommand) {
    return this.usersService.register(registerCommand);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginCommand: LoginCommand) {
    return this.usersService.login(loginCommand);
  }

  @Patch('/:id/role')
  @HttpCode(200)
  async changeRole(
    @Param('id') id: string,
    @Body() changeRoleCommand: ChangeRoleCommand,
  ) {
    return this.usersService.changeRole(id, changeRoleCommand);
  }
}
