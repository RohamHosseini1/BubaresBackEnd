import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator'

export class CreateStructureFeatureDto {
  @MinLength(2)
  @IsString()
  title: string

  @IsPositive()
  @IsNumber()
  unitPrice: number
}
