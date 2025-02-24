import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  data: Date;

  @Prop({
    enum: ["fees Paid", "Credit Note Applied"],
    required: true,
  })
  type: string;

  @Prop({ required: true })
  amount: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

@Schema({ timestamps: true })
export class ServiceFee {
  @Prop({ required: true })
  serviceFeePayable: number;

  @Prop({ required: true })
  serviceFeePaid: number;

  @Prop({ required: true })
  creditNoteApplied: number;

  @Prop({ required: true })
  goodwillGesture: number;

  @Prop({ required: true })
  balancePayable: number;  // Changed to number for consistency

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Reference to the User schema

  @Prop({ type: [Transaction], default: [] })
  transaction: Transaction[];
}

export const ServiceFeeSchema = SchemaFactory.createForClass(ServiceFee);
