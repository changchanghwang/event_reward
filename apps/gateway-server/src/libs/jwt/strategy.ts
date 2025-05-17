import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { unauthorized } from '@libs/exceptions';
import { Role } from '@libs/guards/role';

export interface JwtPayload {
  userId: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    console.log('!!!', payload);
    if (!payload) {
      throw unauthorized('Invalid token', {
        errorMessage: 'Unauthorized',
      });
    }

    return {
      userId: payload.userId,
      role: payload.role,
    };
  }
}
