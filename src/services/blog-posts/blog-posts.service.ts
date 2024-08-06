import { Injectable } from '@nestjs/common'
import { CreateBlogPostDto } from './dto/create-blog-post.dto'
import { UpdateBlogPostDto } from './dto/update-blog-post.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { HandleException } from 'helpers/handle.exception'
import { excludeFromObject } from 'helpers/utils'
import { Prisma } from '@prisma/client'

@Injectable()
export class BlogPostsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBlogPostDto) {
    const createdItem = await this.prisma.blogPost
      .create({
        data: {
          ...excludeFromObject(data, ['authorId', 'categories']),

          author: {
            connect: {
              id: data.authorId,
            },
          },

          categories: {
            connectOrCreate: data.categories.map((e) => ({
              where: {
                title: e,
              },
              create: {
                title: e,
              },
            })),
          },
        },
        omit: {
          body: true,
        },
      })
      .catch((err) => {
        throw new HandleException('Could not create.', 400, err)
      })

    return createdItem
  }

  async findAll() {
    return await this.prisma.blogPost.findMany({
      omit: {
        body: true,
      },
      include: {
        categories: {
          select: {
            title: true,
          },
        },
      },
    })
  }

  async findOne(key: string, mode: 'ID' | 'SLUG' = 'SLUG') {
    let whereInput: Prisma.BlogPostWhereUniqueInput = {
      slug: key,
    }

    if (mode === 'ID') {
      whereInput = {
        id: +key,
      }
    }

    const foundItem = await this.prisma.blogPost.findUniqueOrThrow({
      where: whereInput,
      include: {
        categories: {
          select: {
            title: true,
          },
        },
      },
    })

    return foundItem
  }

  update(id: number, updateBlogPostDto: UpdateBlogPostDto) {
    return `This action updates a #${id} blogPost`
  }

  remove(id: number) {
    return `This action removes a #${id} blogPost`
  }
}
