import { Type } from 'class-transformer'
import { ValidateNested, IsObject, IsDefined, ArrayNotEmpty, IsArray } from 'class-validator'
import { CreateMaterialDto } from './create-material.dto'

export class BulkCreateMaterialDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsDefined({ each: true })
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => CreateMaterialDto)
  materials: CreateMaterialDto[]
}
