import { Activity } from '@services/activities/domain/model';
import { Event, EventStatus, EventType } from '@services/events/domain/model';
import {
  RewardRequest,
  RewardRequestStatus,
} from '@services/reward-requests/domain/model';
import { Reward, RewardType } from '@services/rewards/domain/model';
import { plainToInstance } from 'class-transformer';

export function eventOf(args: {
  id?: string;
  type?: EventType;
  startAt?: Date;
  endAt?: Date;
  status?: EventStatus;
  transitAt?: Date;
}) {
  return plainToInstance(Event, {
    id: args.id ?? 'test-id',
    type: args.type ?? EventType.ATTENDANCE,
    startAt: args.startAt,
    endAt: args.endAt,
    status: args.status ?? EventStatus.SCHEDULED,
    transitAt: args.transitAt,
  });
}

export function rewardRequestOf(args: {
  id?: string;
  status?: RewardRequestStatus;
  requestedAt?: Date;
  transitAt?: Date;
  userId?: string;
  eventId?: string;
  rewardId?: string;
}) {
  return plainToInstance(RewardRequest, {
    id: args.id ?? 'test-id',
    status: args.status ?? RewardRequestStatus.REQUESTED,
    requestedAt: args.requestedAt ?? new Date('2025-05-16T09:00:00.000Z'),
    transitAt: args.transitAt,
    userId: args.userId ?? 'test-user-id',
    eventId: args.eventId ?? 'test-event-id',
    rewardId: args.rewardId ?? 'test-reward-id',
  });
}

export function rewardOf(args: {
  id?: string;
  type?: RewardType;
  amount?: number;
  eventId?: string;
  referenceId?: string;
  isManual?: boolean;
  required?: number;
}) {
  return plainToInstance(Reward, {
    id: args.id ?? 'test-id',
    type: args.type ?? RewardType.POINT,
    amount: args.amount ?? 100,
    eventId: args.eventId ?? 'test-event-id',
    referenceId: args.referenceId,
    isManual: args.isManual ?? false,
    required: args.required ?? 1,
  });
}

export function activityOf(args: {
  id?: string;
  userId?: string;
  eventId?: string;
  participatedOn?: CalendarDate;
}) {
  return plainToInstance(Activity, {
    id: args.id ?? 'test-id',
    userId: args.userId ?? 'test-user-id',
    eventId: args.eventId ?? 'test-event-id',
    participatedOn: args.participatedOn ?? new Date('2025-05-16T09:00:00.000Z'),
  });
}
