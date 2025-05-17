import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { forbidden, internalServerError } from '@libs/exceptions';

const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw forbidden('User not found', {
        errorMessage: '권한이 없습니다.',
      });
    }

    if (user.role === Role.ADMIN) {
      return true;
    }

    if (!user.role) {
      throw forbidden('User role not found', {
        errorMessage: '권한이 없습니다.',
      });
    }

    if (requiredRoles.some((role) => user.role === role)) {
      return true;
    }

    throw forbidden(
      `User role(${
        user.role
      }) is not allowed to access this resource(${requiredRoles.join(', ')})`,
      {
        errorMessage: '권한이 없습니다.',
      },
    );
  }
}
