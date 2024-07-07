import { Role } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsEnum(Role)
  @IsOptional()
  role: Role

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
  email: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  password: string
}
