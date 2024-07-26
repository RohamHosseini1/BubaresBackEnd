// import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
// import { BoilerplateService } from './boilerplate.service'
// import { CreateBoilerplateDto } from './dto/create-boilerplate.dto'
// import { UpdateBoilerplateDto } from './dto/update-boilerplate.dto'

// @Controller('boilerplates')
// export class BoilerplateController {
//   constructor(private readonly boilerplateService: BoilerplateService) {}

//   @Post()
//   create(@Body() input: CreateBoilerplateDto) {
//     return this.boilerplateService.create(input)
//   }

//   @Get()
//   findAll() {
//     return this.boilerplateService.findAll()
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() input: UpdateBoilerplateDto) {
//     return this.boilerplateService.update(+id, input)
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.boilerplateService.remove(+id)
//   }

//   // @ApiOperation({ summary: 'Manually send alarms based on all Boilerplates' })
//   // @UseGuards(IsAdminGuard)
// }
