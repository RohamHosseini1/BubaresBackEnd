import { Role } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsEnum(Role)
  @IsOptional()
  role: Role

  @MinLength(3)
  @IsString()
  @IsOptional()
  name: string

  @MaxLength(11)
  @MinLength(11)
  @IsString()
  @IsOptional()
  phone?: string

  @IsEmail()
  @MinLength(5)
  @IsString()
  @IsOptional()
  email?: string

  @MinLength(5)
  @IsString()
  @IsOptional()
  jobTitle?: string

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  @IsOptional()
  password?: string
}
