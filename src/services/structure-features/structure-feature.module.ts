import { Module } from '@nestjs/common'
import { StructureFeatureController } from './structure-feature.controller'
import { StructureFeatureService } from './structure-feature.service'

@Module({
  controllers: [StructureFeatureController],
  providers: [StructureFeatureService],
})
export class StructureFeatureModule {}
