// service-fee.dto.ts
import { IsNumber, IsString, IsArray, IsNotEmpty, IsMongoId, IsEnum, IsOptional, IsDateString, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// DTO for Transaction
export class TransactionDto {
  @IsDateString()
  data: Date;

  @IsEnum(["fees Paid", "Credit Note Applied"])
  type: string;

  @IsNumber()
  amount: number;
}

// DTO for Creating Service Fee
export class CreateServiceFeeDto {
  @IsNumber()
  serviceFeePayable: number;

  @IsNumber()
  serviceFeePaid: number;

  @IsNumber()
  creditNoteApplied: number;

  @IsNumber()
  goodwillGesture: number;

  @IsNumber()
  balancePayable: number;

  @IsArray()
  @Type(() => TransactionDto)
  transaction: TransactionDto[];
}

// DTO for Updating Service Fee
export class UpdateServiceFeeDto {

  @IsMongoId()
  serviceFeeId?: string;

  @IsOptional()
  @IsNumber()
  serviceFeePayable?: number;

  @IsOptional()
  @IsNumber()
  serviceFeePaid?: number;

  @IsOptional()
  @IsNumber()
  creditNoteApplied?: number;

  @IsOptional()
  @IsNumber()
  goodwillGesture?: number;

  @IsOptional()
  @IsNumber()
  balancePayable?: number;

  @IsOptional()
  @IsMongoId()
  userId?: string;  // Reference to the User ID

  @IsOptional()
  @IsArray()
  @Type(() => TransactionDto)
  transaction?: TransactionDto[];
}
