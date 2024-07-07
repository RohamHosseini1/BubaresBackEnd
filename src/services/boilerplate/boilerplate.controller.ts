// import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
// import { BoilerplateService } from './boilerplate.service'
// import { CreateAlarmRuleDto } from './dto/create-boilerplate.dto'
// import { UpdateAlarmRuleDto } from './dto/update-boilerplate.dto'

// export interface IGetMyAlarmsFilters {
//   unreadOnly: boolean
// }

// @Controller('alarm-rules')
// export class BoilerplateController {
//   constructor(private readonly boilerplateService: BoilerplateService) {}

//   @Post()
//   create(@Body() createAlarmRuleDto: CreateAlarmRuleDto) {
//     return this.boilerplateService.create(createAlarmRuleDto)
//   }

//   @Get()
//   findAll() {
//     return this.boilerplateService.findAll()
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAlarmRuleDto: UpdateAlarmRuleDto) {
//     return this.boilerplateService.update(+id, updateAlarmRuleDto)
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.boilerplateService.remove(+id)
//   }

//   // @ApiOperation({ summary: 'Manually send alarms based on all AlarmRules' })
//   // @UseGuards(IsAdminGuard)
// }
