import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class ServiceFee {
  @Prop({
    enum: ["fee_paid", "credit_note", "goodwill"],  // Corrected the typo here
    required: true,
  })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;  // Reference to the User schema

  @Prop({ type: Number, required: true })  // Added 'required' if the amount is mandatory
  amount: number;
}

// Create the schema from the class
export const ServiceFeeSchema = SchemaFactory.createForClass(ServiceFee);
