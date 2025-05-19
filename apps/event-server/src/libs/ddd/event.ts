import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DddEventDocument = DddEvent & Document;

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true })
export class DddEvent {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  occurredAt: Date;

  @Prop({ required: true })
  data: string;

  @Prop({ required: true })
  txId: string;

  constructor() {
    this.type = this.constructor.name;
    this.occurredAt = new Date();
  }

  withTxId(txId: string) {
    this.txId = txId;
    return this;
  }

  serialize() {
    const { type: _, occurredAt: __, txId: ___, ...rest } = this;
    this.data = JSON.stringify(rest);

    for (const key in rest) {
      if (Object.prototype.hasOwnProperty.call(rest, key)) {
        delete this[key];
      }
    }

    return this;
  }
}

export const DddEventSchema = SchemaFactory.createForClass(DddEvent);
