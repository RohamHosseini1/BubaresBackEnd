import { IsEmail, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @MinLength(3)
  @IsString()
  name: string

  @MaxLength(11)
  @MinLength(11)
  @IsString()
  phone: string

  @IsEmail()
  @MinLength(5)
  @IsString()
  @IsOptional()
  email: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @IsOptional()
  password: string
}
