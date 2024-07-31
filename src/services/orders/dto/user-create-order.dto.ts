import { StructureApplications } from '@prisma/client'
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator'
import { iranProvincesList } from 'constants/iranProvinces'
import { IsValidProvince } from 'src/services/structures/dto/create-structure.dto'

export class UserCreateOrderDto {
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

  @MaxLength(11)
  @MinLength(11)
  @IsString()
  @IsDefined()
  phoneNumber: string
}
