import { Injectable } from '@nestjs/common'
import { CreateBlogPostDto } from './dto/create-blog-post.dto'
import { UpdateBlogPostDto } from './dto/update-blog-post.dto'
import { PaginateOptions, PrismaService } from 'src/prisma/prisma.service'
import { HandleException } from 'helpers/handle.exception'
import { excludeFromObject } from 'helpers/utils'
import { BlogPost, Prisma } from '@prisma/client'
import { S3ClientService } from '../s3-client/s3-client.service'

@Injectable()
export class BlogPostsService {
  constructor(
    private prisma: PrismaService,
    private readonly s3Client: S3ClientService,
  ) {}

  async create(data: CreateBlogPostDto) {
    await this.prisma.blogPost
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

    return {
      message: 'Blog post created successfully.',
    }
  }

  async findAll(paginateOptions: PaginateOptions) {
    const findManyArgs: Prisma.BlogPostFindManyArgs = {
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
    }

    // with pagination
    if (paginateOptions.page || paginateOptions.perPage)
      return PrismaService.paginate<BlogPost>(this.prisma.blogPost, paginateOptions, findManyArgs)

    // without pagination
    findManyArgs.take = 20
    return await this.prisma.blogPost.findMany(findManyArgs)
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

  async update(id: number, data: UpdateBlogPostDto) {
    const metaData: Record<string, number | boolean> = {}

    if (data.thumbnail || data.body) {
      const foundItem = await this.prisma.blogPost
        .findUniqueOrThrow({
          where: {
            id,
          },
        })
        .catch((err) => {
          throw new HandleException('No blog post found with the given id.', 400, err)
        })

      if (data.thumbnail) {
        if (foundItem.thumbnail !== data.thumbnail) {
          this.s3Client.deleteObject(foundItem.thumbnail)
          metaData.oldThumbnailDeleted = true
        }
      }

      if (data.body) {
        const oldBodyImageKeys = Array.from(foundItem.body.matchAll(/\/blog-images\/[^"']+/g), (match) => match[0])
        const newBodyImageKeys = Array.from(data.body.matchAll(/\/blog-images\/[^"']+/g), (match) => match[0])

        const imagesToBeDeleted = oldBodyImageKeys.filter((item) => !newBodyImageKeys.includes(item))
        Promise.allSettled(imagesToBeDeleted.map((e) => this.s3Client.deleteObject(e))).then()

        metaData.oldBodyImagesDeletedCount = imagesToBeDeleted.length
      }
    }

    await this.prisma.blogPost
      .update({
        where: {
          id,
        },

        data: {
          ...excludeFromObject(data, ['authorId', 'categories']),

          ...(data.authorId && {
            author: {
              connect: {
                id: data.authorId,
              },
            },
          }),

          ...(data.categories && {
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
          }),
        },

        omit: {
          body: true,
        },
      })
      .catch((err) => {
        throw new HandleException('Could not update.', 400, err)
      })

    return {
      message: 'Blog post updated successfully',
      metaData,
    }
  }

  async remove(id: number) {
    const foundItem = await this.prisma.blogPost
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch((err) => {
        throw new HandleException('No blog found with the given id.', 404, err)
      })

    // delete images from s3 bucket
    const bodyImageKeys = Array.from(foundItem.body.matchAll(/\/blog-images\/[^"']+/g), (match) => match[0])
    const imagesToBeDeleted = [foundItem.thumbnail, ...bodyImageKeys]

    Promise.allSettled(imagesToBeDeleted.map((e) => this.s3Client.deleteObject(e))).then()

    // delete the blog
    await this.prisma.blogPost
      .delete({
        where: {
          id,
        },
      })
      .catch((err) => {
        throw new HandleException('Could not delete', 500, err)
      })

    return {
      message: 'Blog post deleted successfully',
      imagesDeletedCount: imagesToBeDeleted.length,
    }
  }
}
