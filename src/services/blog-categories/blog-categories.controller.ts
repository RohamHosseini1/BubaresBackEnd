import { Controller, Get, Query } from '@nestjs/common'
import { Public } from 'src/guards/auth.guard'
import { BlogCategoriesService } from './blog-categories.service'

@Controller('blogCategories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @Get()
  @Public()
  findAll(@Query('page') page: string, @Query('perPage') perPage: string, @Query('search') search: string) {
    const paginateOptions = { page, perPage }

    return this.blogCategoriesService.findAll(paginateOptions, search)
  }
}
