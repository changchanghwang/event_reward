import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { RegisterRewardValidator } from '@services/rewards/domain/services';
import { Document } from 'mongoose';
import { v7 } from 'uuid';

export type RewardDocument = Reward & Document;

export enum RewardType {
  POINT = 'POINT',
  ITEM = 'ITEM',
  COUPON = 'COUPON',
}

@Schema({ timestamps: true })
export class Reward {
  @Prop({ required: true, unique: true, trim: true })
  id: string;

  @Prop({ required: true })
  type: RewardType;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: false })
  referenceId?: string; // item의 경우 itemId, coupon의 경우 couponId

  @Prop({ required: true })
  isManual: boolean;

  @Prop({ required: true })
  required: number;

  constructor(args: {
    id: string;
    type: RewardType;
    amount: number;
    eventId: string;
    referenceId?: string;
    isManual: boolean;
    required: number;
  }) {
    if (args) {
      this.id = args.id;
      this.type = args.type;
      this.amount = args.amount;
      this.eventId = args.eventId;
      this.referenceId = args.referenceId;
      this.isManual = args.isManual;
      this.required = args.required;
    }
  }

  static async from(args: {
    type: RewardType;
    amount: number;
    eventId: string;
    referenceId?: string;
    isManual: boolean;
    required: number;
    registerValidator: RegisterRewardValidator;
  }): Promise<Reward> {
    await args.registerValidator.validate(args.eventId);

    return new Reward({
      id: v7(),
      type: args.type,
      amount: args.amount,
      eventId: args.eventId,
      referenceId: args.referenceId,
      isManual: args.isManual,
      required: args.required,
    });
  }
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
