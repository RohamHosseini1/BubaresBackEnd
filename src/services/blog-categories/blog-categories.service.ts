import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginateOptions, PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class BlogCategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll(paginateOptions: PaginateOptions, search: string) {
    const blogCategoryWhereInput = {
      title: { contains: search || '' },
    } as Prisma.BlogCategoryWhereInput

    if (paginateOptions.page || paginateOptions.perPage)
      return PrismaService.paginate(this.prisma.blogCategory, paginateOptions, {
        where: blogCategoryWhereInput,
      })

    return this.prisma.blogCategory.findMany({
      where: blogCategoryWhereInput,
      take: 100,
    })
  }
}
