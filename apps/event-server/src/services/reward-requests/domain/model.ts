import { badRequest } from '@libs/exceptions';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v7 } from 'uuid';

export type RewardRequestDocument = RewardRequest & Document;

export enum RewardRequestStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class RewardRequest {
  @Prop({ required: true, unique: true, trim: true })
  id: string;

  @Prop({ required: true })
  status: RewardRequestStatus;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  rewardId: string;

  @Prop({ required: true })
  requestedAt: Date;

  @Prop()
  transitAt?: Date;

  constructor(args: {
    id: string;
    status: RewardRequestStatus;
    requestedAt: Date;
    userId: string;
    eventId: string;
    rewardId: string;
    transitAt?: Date;
  }) {
    if (args) {
      this.id = args.id;
      this.status = args.status;
      this.requestedAt = args.requestedAt;
      this.userId = args.userId;
      this.eventId = args.eventId;
      this.rewardId = args.rewardId;
      this.transitAt = args.transitAt;
    }
  }

  static from(args: {
    userId: string;
    eventId: string;
    rewardId: string;
    status: RewardRequestStatus;
  }): RewardRequest {
    return new RewardRequest({
      id: v7(),
      status: args.status,
      requestedAt: new Date(),
      userId: args.userId,
      eventId: args.eventId,
      rewardId: args.rewardId,
    });
  }

  approve() {
    if (this.status !== RewardRequestStatus.REQUESTED) {
      throw badRequest(
        `Can not approve Reward request(${this.id}). It is not requested`,
        {
          errorMessage: '이미 완료된 리워드 요청을 승인할 수 없습니다.',
        },
      );
    }

    this.status = RewardRequestStatus.APPROVED;
    this.transitAt = new Date();
  }

  reject() {
    if (this.status !== RewardRequestStatus.REQUESTED) {
      throw badRequest(
        `Can not reject Reward request(${this.id}). It is not requested`,
        {
          errorMessage: '이미 완료된 리워드 요청을 거절할 수 없습니다.',
        },
      );
    }

    this.status = RewardRequestStatus.REJECTED;
    this.transitAt = new Date();
  }
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);

RewardRequestSchema.index(
  { userId: 1, eventId: 1, rewardId: 1 },
  { unique: true },
);
