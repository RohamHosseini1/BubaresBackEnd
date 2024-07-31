import { StructureApplications } from '@prisma/client'
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  Validate,
} from 'class-validator'
import { iranProvincesList } from 'constants/iranProvinces'
import { IsValidProvince } from 'src/services/structures/dto/create-structure.dto'

export class AdminCreateOrderDto {
  @IsEnum(StructureApplications)
  application: StructureApplications

  @IsPositive()
  @IsInt()
  @IsOptional()
  floorsNumber: number

  @IsPositive()
  @IsInt()
  @IsOptional()
  size: number

  @Validate(IsValidProvince)
  @IsDefined()
  @IsObject()
  province: (typeof iranProvincesList)[number]

  @IsString()
  phoneNumber: string

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
  name?: string

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
}
