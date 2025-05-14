import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepositoryImpl } from './infrastructure/repository-impl';
import { User, UserSchema } from './domain/model';
import { UserController } from './presentation/controller';
import { UsersService } from './application';
import { PasswordHashService } from './domain/services';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  exports: [],
})
export class UsersModule {}
