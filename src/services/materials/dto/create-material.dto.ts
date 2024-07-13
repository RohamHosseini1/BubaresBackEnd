import { MaterialUnits } from '@prisma/client'
import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator'

export class CreateMaterialDto {
  @IsEnum(MaterialUnits)
  unit: MaterialUnits

  @Min(0)
  @IsNumber()
  @IsOptional()
  unitPrice: number

  @MinLength(2)
  @IsString()
  title: string
}
