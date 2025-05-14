import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashService {
  async hash(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
