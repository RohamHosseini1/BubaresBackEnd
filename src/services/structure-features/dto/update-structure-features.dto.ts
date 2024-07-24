import { PartialType } from '@nestjs/swagger'
import { CreateStructureFeatureDto } from './create-structure-feature.dto'

export class UpdateStructureFeatureDto extends PartialType(CreateStructureFeatureDto) {}
