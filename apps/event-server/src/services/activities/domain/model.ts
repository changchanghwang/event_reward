import { AggregateRoot } from '@libs/ddd/aggregate';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ActivityRegisteredEvent } from '@services/activities/domain/events';
import { Document } from 'mongoose';
import { v7 } from 'uuid';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity extends AggregateRoot {
  @Prop({ required: true, unique: true, trim: true })
  id: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  participatedOn: CalendarDate;

  constructor(args: {
    id: string;
    eventId: string;
    userId: string;
    participatedOn: CalendarDate;
  }) {
    super();
    if (args) {
      this.id = args.id;
      this.eventId = args.eventId;
      this.userId = args.userId;
      this.participatedOn = args.participatedOn;
    }
  }

  static from(args: {
    eventId: string;
    userId: string;
    participatedOn: CalendarDate;
  }): Activity {
    const activity = new Activity({
      id: v7(),
      eventId: args.eventId,
      userId: args.userId,
      participatedOn: args.participatedOn,
    });

    activity.publishEvent(
      new ActivityRegisteredEvent(
        activity.id,
        activity.eventId,
        activity.userId,
        activity.participatedOn,
      ),
    );
    return activity;
  }
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
