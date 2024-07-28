import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { MaterialService } from './material.service'
import { CreateMaterialDto } from './dto/create-material.dto'
import { UpdateMaterialDto } from './dto/update-material.dto'
import { IsAdminGuard } from 'src/guards/is-admin.guard'
import { BulkCreateMaterialDto } from './dto/bulk-create-material.dto'

@Controller('materials')
@UseGuards(IsAdminGuard)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialService.create(createMaterialDto)
  }

  @Post('/bulk-create')
  bulkCreate(@Body() input: BulkCreateMaterialDto) {
    return this.materialService.bulkCreate(input.materials)
  }

  @Get()
  findAll() {
    return this.materialService.findAll()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
    return this.materialService.update(+id, updateMaterialDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialService.remove(+id)
  }
}
