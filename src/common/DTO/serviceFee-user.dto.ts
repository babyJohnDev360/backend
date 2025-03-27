// service-fee.dto.ts
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsEnum,
  IsOptional,
} from 'class-validator';

// DTO for creating a Service Fee
export class CreateServiceFeeDto {
  @IsEnum(['fee_paid', 'credit_note', 'goodwill'], {
    message: 'type must be one of the following values: fee_paid, credit_note, goodwill',
  }) // Corrected enum values
  type: string;

  @IsNumber()
  amount: number;

  @IsMongoId()  // Ensures that userId is a valid MongoDB ObjectId
  userId: string;  // MongoDB ObjectId (refers to the User schema)
}

// DTO for updating a Service Fee
export class UpdateServiceFeeDto {
  @IsOptional()
  @IsString()
  serviceFeeId?: string;  // Optional, the ID of the service fee you want to update

  @IsOptional()
  @IsEnum(['fee_paid', 'credit_note', 'goodwill'], {
    message: 'type must be one of the following values: fee_paid, credit_note, goodwill',
  })  // Optional, ensures the type is one of the valid enum values
  type?: string;

  @IsOptional()
  @IsMongoId()  // Ensures that userId is a valid MongoDB ObjectId
  userId?: string;

  @IsOptional()
  @IsNumber()  // Optional, ensures the amount is a number
  amount?: number;
}

// DTO for getting Service Fees by userId
export class getServiceFeeDto {
  @IsOptional()
  @IsMongoId()  // Ensures that userId is a valid MongoDB ObjectId
  userId?: string;
}
