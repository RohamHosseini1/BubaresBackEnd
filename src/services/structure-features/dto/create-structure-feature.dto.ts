import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator'

export class CreateStructureFeatureDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  id?: number

  @MinLength(2)
  @IsString()
  title: string

  @MinLength(10)
  @IsString()
  @IsOptional()
  description?: string

  @IsPositive()
  @IsNumber()
  unitPrice: number
}
