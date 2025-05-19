import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParticipationDocument = Participation & Document;

@Schema({ timestamps: true })
export class Participation {
  @Prop({ required: true, unique: true, trim: true })
  id: string;

  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  participatedAt: Date;

  constructor(args: {
    id: string;
    eventId: string;
    userId: string;
    participatedAt: Date;
  }) {
    if (args) {
      this.id = args.id;
      this.eventId = args.eventId;
      this.userId = args.userId;
      this.participatedAt = args.participatedAt;
    }
  }
}

export const ParticipationSchema = SchemaFactory.createForClass(Participation);
