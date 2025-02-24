import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';


export enum FundType {
  ADD = 'add',
  REMOVE = 'remove',
}

@Schema({ timestamps: true })
export class FundAllot {
  @Prop({ default: () => uuidv4() })
  transactionId: string;  // UUID auto-generated

  @Prop()
  amount: number;

  @Prop({enum: FundType})
  type: string;

  @Prop()
  balance: number;

  @Prop()
  source: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;  // Reference to the User schema
}

export const FundAllotSchema = SchemaFactory.createForClass(FundAllot);
