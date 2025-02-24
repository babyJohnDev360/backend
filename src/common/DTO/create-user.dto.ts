import { IsString, IsEmail, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

// BankDetails DTO class
class BankDetailsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  accountNo?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  ifsc?: string;

  @IsOptional()
  @IsString()
  panNumber?: string;
}

// Create User DTO class
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  panNo: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  bankDetails: BankDetailsDto; // embedded object
}

// Update User DTO class
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  panNo?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  bankDetails?: BankDetailsDto; // embedded object
}

export class LoginUserDto {

    @IsEmail()
    @IsNotEmpty()
    email : string 

    @IsString()
    @IsNotEmpty()
   password : string 

}
