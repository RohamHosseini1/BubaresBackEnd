import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { StructureService } from './structure.service'
import { CreateStructureDto } from './dto/create-structure.dto'
import { UpdateStructureDto } from './dto/update-structure.dto'
import { ApiOperation } from '@nestjs/swagger'
import { S3ClientService } from '../s3-client/s3-client.service'
import { IsAdminGuard } from 'src/guards/is-admin.guard'
import { HandleException } from 'helpers/handle.exception'

@Controller('structures')
@UseGuards(IsAdminGuard)
export class StructureController {
  constructor(
    private readonly structureService: StructureService,
    private readonly s3ClientService: S3ClientService,
  ) {}

  @Post()
  create(@Body() input: CreateStructureDto) {
    return this.structureService.create(input)
  }

  @Get()
  findAll() {
    return this.structureService.findAll()
  }

  @ApiOperation({ summary: 'Getting the upload link of both 3d model and its thumbnail to the s3 bucket' })
  @Get('upload-facade-data-url')
  @UseGuards(IsAdminGuard)
  getUploadFacadeDataUrl() {
    return this.s3ClientService.getUploadFacadeDataUrl()
  }

  @ApiOperation({ summary: 'For deleting the Model or the Thumbnail from the s3 bucket' })
  @Delete('facade-data')
  @UseGuards(IsAdminGuard)
  deleteFacadeData(@Body() body: { key: string; type: 'MODEL' | 'THUMBNAIL' }) {
    if (!body.key) throw new HandleException('Missing attribute `key`', 400)
    if (!body.type || !['MODEL', 'THUMBNAIL'].includes(body.type))
      throw new HandleException(`Body must be either 'MODEL' | 'THUMBNAIL'`, 400)

    return this.s3ClientService.deleteFacadeData(body, true)
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
