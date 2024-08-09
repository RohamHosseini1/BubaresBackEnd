import { IsString, IsDefined, IsOptional, IsInt, ArrayNotEmpty, IsArray, MinLength, IsEmail } from 'class-validator'

export class UserUpdateOrderDto {
  @IsString()
  @IsDefined()
  @IsOptional()
  facadeTitle?: string

  @IsInt({ each: true })
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  structureFeatures?: number[]

  @MinLength(3)
  @IsString()
  @IsOptional()
  name: string

  @IsEmail()
  @MinLength(5)
  @IsString()
  @IsOptional()
  email?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  city?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  village?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  neighborhood?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  description?: string
}
