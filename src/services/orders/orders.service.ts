import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PaginateOptions, PrismaService } from 'src/prisma/prisma.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
// import { excludeFromObject } from 'helpers/utils'
import { Order } from '@prisma/client'

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // async adminCreate(data: CreateOrderDto) {
  //   const createdItem = await this.prisma.order
  //     .create({
  //       data,
  //     })
  //     .catch((err) => {
  //       throw new HandleException('Could not create.', 400, err)
  //     })

  //   return createdItem
  // }

  async adminFindAll(paginateOptions: PaginateOptions) {
    const paginatedResult = await PrismaService.paginate<Order>(this.prisma.order, paginateOptions)

    return paginatedResult
  }

  // async adminUpdate(id: number, data: UpdateOrderDto) {
  //   const updatedItem = await this.prisma.order
  //     .update({
  //       where: {
  //         id,
  //       },
  //       data,
  //     })
  //     .catch((err) => {
  //       throw new HandleException('Could not update', 500, err)
  //     })

  //   return updatedItem
  // }

  async adminRemove(id: string) {
    const deletedItem = await this.prisma.order
      .delete({
        where: {
          id,
        },
      })
      .catch((err) => {
        throw new HandleException('Could not delete', 500, err)
      })

    return deletedItem
  }

  // async userCreate(data: CreateOrderDto) {
  //   const createdItem = await this.prisma.order
  //     .create({
  //       data,
  //     })
  //     .catch((err) => {
  //       throw new HandleException('Could not create.', 400, err)
  //     })

  //   return createdItem
  // }

  async userFindAll(userId: number, paginateOptions: PaginateOptions) {
    const paginatedResult = await PrismaService.paginate<Order>(this.prisma.order, paginateOptions, {
      where: {
        userId,
      },
    })

    return paginatedResult
  }

  // async userUpdate(id: number, data: UpdateOrderDto) {
  //   const finalData = excludeFromObject(data, ['province', 'floorsNumber', 'size', 'application'])

  //   const updatedItem = await this.prisma.order
  //     .update({
  //       where: {
  //         id,
  //       },
  //       data: finalData,
  //     })
  //     .catch((err) => {
  //       throw new HandleException('Could not update', 500, err)
  //     })

  //   return updatedItem
  // }

  async userRemove(userId: number, orderId: string) {
    const foundOrder = await this.prisma.order
      .findUniqueOrThrow({
        where: {
          id: orderId,
        },
      })
      .catch((err) => {
        throw new HandleException('No order found with the given id', 404, err)
      })

    if (foundOrder.userId !== userId) {
      throw new HandleException('This order is not yours.', 403)
    }

    const deletedItem = await this.prisma.order
      .delete({
        where: {
          id: orderId,
        },
      })
      .catch((err) => {
        throw new HandleException('Could not delete', 500, err)
      })

    return deletedItem
  }
}
