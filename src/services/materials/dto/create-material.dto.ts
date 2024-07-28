import { MaterialUnits } from '@prisma/client'
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from 'class-validator'

export class CreateMaterialDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  id?: number

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
