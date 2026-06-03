import { IsString, IsEmail, MinLength, IsDateString } from "class-validator";

export class CreateUserInputDto {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsDateString()
  birthday!: string;
}
