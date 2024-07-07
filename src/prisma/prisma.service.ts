import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

export interface PaginatedResult<T> {
  results: T[]
  count: number
  hasNext: boolean
  meta: {
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export type PaginateOptions = { page?: number | string; perPage?: number | string }

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // The onModuleInit is optional — if you leave it out, Prisma will connect lazily on its first call to the database.
  async onModuleInit() {
    await this.$connect()
  }

  public static async paginate<T>(
    model: any,
    options?: PaginateOptions,
    args: any = { where: undefined },
  ): Promise<PaginatedResult<T>> {
    let page = Number(options?.page) || 1
    let perPage = Number(options?.perPage) || 10

    if (page < 1) page = 1
    if (perPage > 100) perPage = 100
    else if (perPage < 1) perPage = 1

    const skip = perPage * (page - 1)

    const [total, results] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ])

    const lastPage = Math.ceil(total / perPage)
    const next = page < lastPage ? page + 1 : null

    return {
      results,
      count: total,
      hasNext: next != null,
      meta: {
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next,
      },
    }
  }
}
