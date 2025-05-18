import { Module } from '@nestjs/common';
import { UserRepositoryImpl } from './infrastructure/repository-impl';
import { UserController } from './presentation/controller';
import { UsersService } from './application';
import { PasswordHashService } from './domain/services';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    PasswordHashService,
  ],
})
export class UsersModule {}
