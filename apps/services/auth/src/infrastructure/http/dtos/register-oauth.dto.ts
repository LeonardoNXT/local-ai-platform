import {
  IsEmail,
  IsISO8601,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from "class-validator";

export class OAuthRegisterDto {
  @IsString()
  @MinLength(8)
  name!: string;

  @IsString()
  @MinLength(5)
  username!: string;

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @IsStrongPassword()
  password!: string;

  @IsString()
  @IsISO8601()
  birthday!: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  deviceName?: string;
}
