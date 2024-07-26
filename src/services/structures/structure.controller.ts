import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { StructureService } from './structure.service'
import { CreateStructureDto } from './dto/create-structure.dto'
import { UpdateStructureDto } from './dto/update-structure.dto'

@Controller('structures')
export class StructureController {
  constructor(private readonly structureService: StructureService) {}

  @Post()
  create(@Body() input: CreateStructureDto) {
    return this.structureService.create(input)
  }

  @Get()
  findAll() {
    return this.structureService.findAll()
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateStructureDto) {
    return this.structureService.update(+id, input)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.structureService.remove(+id)
  }

  // @ApiOperation({ summary: 'Manually send alarms based on all Structures' })
  // @UseGuards(IsAdminGuard)
}
