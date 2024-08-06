import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { StructureFeatureService } from './structure-feature.service'
import { CreateStructureFeatureDto } from './dto/create-structure-feature.dto'
import { UpdateStructureFeatureDto } from './dto/update-structure-features.dto'
import { IsAdminGuard } from 'src/guards/is-admin.guard'
import { BulkCreateStructureFeatureDto } from './dto/bulk-create-structure-feature.dto'

@Controller('structure-features')
@UseGuards(IsAdminGuard)
export class StructureFeatureController {
  constructor(private readonly structureFeatureService: StructureFeatureService) {}

  @Post()
  create(@Body() createStructureFeatureDto: CreateStructureFeatureDto) {
    return this.structureFeatureService.create(createStructureFeatureDto)
  }

  @Post('/bulk-create')
  bulkCreate(@Body() input: BulkCreateStructureFeatureDto) {
    return this.structureFeatureService.bulkCreate(input.features)
  }

  @Get()
  findAll(@Query('page') page: string, @Query('perPage') perPage: string) {
    const paginateOptions = { page, perPage }

    return this.structureFeatureService.findAll(paginateOptions)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStructureFeatureDto: UpdateStructureFeatureDto) {
    return this.structureFeatureService.update(+id, updateStructureFeatureDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.structureFeatureService.remove(+id)
  }

  // @ApiOperation({ summary: 'Manually send alarms based on all StructureFeatures' })
  // @UseGuards(IsAdminGuard)
}
