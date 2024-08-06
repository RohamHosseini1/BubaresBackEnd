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
import { IsValidProvince } from 'helpers/custom-validators'

export class AdminCreateOrderDto {
  @IsEnum(StructureApplications)
  application: StructureApplications

  @IsPositive()
  @IsInt()
  floorsNumber: number

  @IsPositive()
  @IsInt()
  size: number

  @Validate(IsValidProvince)
  @IsDefined()
  @IsObject()
  province: (typeof iranProvincesList)[number]

  @IsString()
  phoneNumber: string

  @IsString()
  @IsDefined()
  facadeTitle: string

  @IsInt({ each: true })
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  structureFeatures?: number[]

  @MinLength(3)
  @IsString()
  name: string

  @IsEmail()
  @MinLength(5)
  @IsString()
  @IsOptional()
  email?: string

  @MinLength(3)
  @IsString()
  city: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  village?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  description?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  neighborhood?: string
}
