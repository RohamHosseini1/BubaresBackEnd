import { Controller, Delete, Get, Param } from '@nestjs/common'
import { FacadesService } from './facades.service'
import { ApiOperation } from '@nestjs/swagger'

@Controller('facades')
export class FacadeController {
  constructor(private readonly facadeService: FacadesService) {}

  @ApiOperation({ summary: 'Returns a random Facade object' })
  @Get('get-random')
  getRandomFacade() {
    return this.facadeService.getRandomFacade()
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facadeService.remove(+id)
  }
}
