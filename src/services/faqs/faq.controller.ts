import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { FaqService } from './faq.service'
import { CreateFAQDto } from './dto/create-faq.dto'
import { UpdateFAQDto } from './dto/update-faq.dto'
import { IsAdminGuard } from 'src/guards/is-admin.guard'

export interface IGetMyAlarmsFilters {
  unreadOnly: boolean
}

@Controller('faqs')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @UseGuards(IsAdminGuard)
  create(@Body() input: CreateFAQDto) {
    return this.faqService.create(input)
  }

  @Get()
  findAll() {
    return this.faqService.findAll()
  }

  @Patch(':id')
  @UseGuards(IsAdminGuard)
  update(@Param('id') id: string, @Body() input: UpdateFAQDto) {
    return this.faqService.update(+id, input)
  }

  @Delete(':id')
  @UseGuards(IsAdminGuard)
  remove(@Param('id') id: string) {
    return this.faqService.remove(+id)
  }
}
