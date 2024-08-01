import { iranProvincesList } from 'constants/iranProvinces'
import { StructureApplications } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
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
  @IsEnum(StructureApplications, { each: true })
  @ArrayUnique()
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  application: StructureApplications[]

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

  @IsInt({ each: true })
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  @IsOptional()
  structureFeatures?: number[]

  @Type(() => FacadeDto)
  @ValidateNested()
  @IsObject({ each: true })
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  facades: FacadeDto[]
}

class MaterialDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  id?: number

  @IsPositive()
  @IsInt()
  materialId: number

  @IsPositive()
  @IsInt()
  quantity: number
}

class FacadeDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  id?: number

  @MaxLength(7)
  @MinLength(6)
  @IsString()
  color: string

  @MinLength(2)
  @IsString()
  title: string

  @MaxLength(60)
  @MinLength(39)
  @IsString()
  modelKey: string

  @MaxLength(60)
  @MinLength(39)
  @IsString()
  thumbnailKey: string
}
