/* eslint-disable prettier/prettier */
import { IsNumber, IsString, IsOptional, IsUUID, IsNotEmpty, IsBoolean, IsEnum } from 'class-validator';
import {  Types } from 'mongoose';

// Create FundAllot DTO
export class CreateFundAllotDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsEnum(["add", "remove"])
  type: "add" | "remove";

  @IsOptional()
  @IsString()
  balance: string;

  @IsString()
  source: string;

//   @IsUUID()
//   transactionId: Types.ObjectId;  // User ID, passed as ObjectId
}
export class UserListDto {
  @IsString()
  @IsOptional()
  userId: string;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsString()
  @IsOptional()
  search: string;
  
//   @IsUUID()
//   transactionId: Types.ObjectId;  // User ID, passed as ObjectId
}

// Update FundAllot DTO
export class UpdateFundAllotDto {


  @IsString()
  @IsNotEmpty()
  fundId : string


  @IsOptional()
  @IsNumber()
  amount?: number;

 @IsOptional()
   @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsUUID()
  userId?: Types.ObjectId;  // User ID, this can be updated if needed
}

// Query DTO for Listing FundAllots
export class FundAllotQueryDto {
  @IsOptional()
  userId?: Types.ObjectId;  // Filter by User ID

  @IsOptional()
  @IsString()
  source?: string;  // Filter by source

  @IsOptional()
  @IsNumber()
  limit?: number;  // For pagination (optional)

  @IsOptional()
  @IsNumber()
  page?: number;  // For pagination (optional)
}
export class FundAllotQueryByUserDto {
  @IsNotEmpty()
  userId?: string;  // Filter by User ID

  @IsOptional()
  @IsString()
  source?: string;  // Filter by source

  @IsOptional()
  @IsNumber()
  limit?: number;  // For pagination (optional)

  @IsOptional()
  @IsNumber()
  page?: number;  // For pagination (optional)
}
