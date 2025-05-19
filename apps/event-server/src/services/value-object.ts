import { badRequest } from '@libs/exceptions';
import { Prop } from '@nestjs/mongoose';

export class Rate {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';

  constructor(args: {
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  }) {
    this.amount = args.amount;
    this.frequency = args.frequency;
  }

  static from(args: {
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  }): Rate {
    if (args.frequency === 'once' && args.amount !== 1) {
      throw badRequest('Amount must be 1 or less for once frequency', {
        errorMessage: `빈도가 '한번'인 경우 횟수는 1 이어야 합니다.`,
      });
    }

    return new Rate(args);
  }
}
