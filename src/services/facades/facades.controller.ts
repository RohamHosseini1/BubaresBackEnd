import { Controller, Delete, Get, Param } from '@nestjs/common'
import { FacadesService } from './facades.service'
import { ApiOperation } from '@nestjs/swagger'
import { Public } from 'src/guards/auth.guard'

@Controller('facades')
export class FacadeController {
  constructor(private readonly facadeService: FacadesService) {}

  @ApiOperation({ summary: 'Returns a random Facade object' })
  @Get('get-random')
  @Public()
  getRandomFacade() {
    return this.facadeService.getRandomFacade()
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.facadeService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facadeService.remove(id)
  }
}
