import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { SetMetadata } from '@nestjs/common';
import { unauthorized } from '@libs/exceptions';
const PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err) {
      throw unauthorized(`Invalid token: ${err}`, {
        errorMessage: 'Unauthorized',
      });
    }
    console.log('!!!', user);

    if (!user) {
      throw unauthorized('User not found', {
        errorMessage: 'Unauthorized',
      });
    }

    return user;
  }
}
