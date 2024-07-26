import { iranProvincesList } from 'constants/iranProvinces'
import { StructureApplications } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'is-valid-province', async: false })
export class IsValidProvince implements ValidatorConstraintInterface {
  validate(input: { provinceId: string }) {
    return !!iranProvincesList.find((e) => input.provinceId === e.provinceId)
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid province object`
  }
}

export class CreateStructureDto {
  @IsEnum(StructureApplications)
  application: StructureApplications

  @IsPositive()
  @IsInt()
  floorsNumber: number

  @IsPositive()
  @IsInt()
  sizeFrom: number

  @IsPositive()
  @IsInt()
  sizeTo: number

  @Validate(IsValidProvince)
  @IsDefined()
  @IsObject()
  province: (typeof iranProvincesList)[number]

  @Type(() => MaterialDto)
  @ValidateNested()
  @IsObject({ each: true })
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  materials: MaterialDto[]

  @IsString({ each: true })
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  structureFeatures?: string[]

  @Type(() => FacadeDto)
  @ValidateNested()
  @IsObject({ each: true })
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  facades: FacadeDto[]
}

class MaterialDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  materialId: string

  @IsPositive()
  @IsInt()
  quantity: number
}

class FacadeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  color: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  modelKey: string

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  thumbnailKey: string

  @IsPositive()
  @IsInt()
  quantity: number
}
