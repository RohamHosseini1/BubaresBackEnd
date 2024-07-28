import { Type } from 'class-transformer'
import { ValidateNested, IsObject, IsDefined, ArrayNotEmpty, IsArray } from 'class-validator'
import { CreateStructureFeatureDto } from './create-structure-feature.dto'

export class BulkCreateStructureFeatureDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsDefined({ each: true })
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => CreateStructureFeatureDto)
  features: CreateStructureFeatureDto[]
}
