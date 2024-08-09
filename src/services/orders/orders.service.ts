import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PaginateOptions, PrismaService } from 'src/prisma/prisma.service'
import { excludeFromObject } from 'helpers/utils'
import { Order } from '@prisma/client'
import { UserCreateOrderDto } from './dto/user-create-order.dto'
import { UserUpdateOrderDto } from './dto/user-update-order.dto'
import { AdminCreateOrderDto } from './dto/admin-create-order.dto'
import { AdminUpdateOrderDto } from './dto/admin-update-order.dto'
import { StructureService } from '../structures/structure.service'

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private readonly structureService: StructureService,
  ) {}

  async adminCreate(data: AdminCreateOrderDto) {
    const createdItem = await this.prisma.order
      .create({
        data: {
          ...excludeFromObject(data, ['phoneNumber']),

          user: {
            connectOrCreate: {
              where: {
                phone: data.phoneNumber,
              },
              create: {
                phone: data.phoneNumber,
              },
            },
          },

          ...(data.structureFeatures && {
            structureFeatures: {
              connect: data.structureFeatures.map((e) => ({ id: e })),
            },
          }),
        },
      })
      .catch((err) => {
        throw new HandleException('Could not create.', 400, err)
      })

    return createdItem
  }

  async adminFindAll(paginateOptions: PaginateOptions) {
    const paginatedResult = await PrismaService.paginate<Order>(this.prisma.order, paginateOptions)

    return paginatedResult
  }

  async adminUpdate(id: string, data: AdminUpdateOrderDto) {
    const updatedItem = await this.prisma.order
      .update({
        where: {
          id,
        },
        data: {
          ...excludeFromObject(data, ['phoneNumber']),

          ...(data.phoneNumber && {
            user: {
              connectOrCreate: {
                where: {
                  phone: data.phoneNumber,
                },
                create: {
                  phone: data.phoneNumber,
                },
              },
            },
          }),

          ...(data.structureFeatures && {
            structureFeatures: {
              connect: data.structureFeatures.map((e) => ({ id: e })),
            },
          }),
        },
      })
      .catch((err) => {
        throw new HandleException('Could not update', 500, err)
      })

    return updatedItem
  }

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

  async userCreate(data: UserCreateOrderDto) {
    const createdItem = await this.prisma.order
      .create({
        data: {
          ...excludeFromObject(data, ['phoneNumber']),

          user: {
            connectOrCreate: {
              where: {
                phone: data.phoneNumber,
              },
              create: {
                phone: data.phoneNumber,
              },
            },
          },
        },
      })
      .catch((err) => {
        throw new HandleException('Could not create.', 400, err)
      })

    const suggestedStructure = await this.structureService.suggestStructure(data)

    return {
      status: 'SUCCESS',
      message: 'order created successfully',
      id: createdItem.id,
      suggestedStructure,
    }
  }

  async userFindAll(userId: number, paginateOptions: PaginateOptions) {
    const paginatedResult = await PrismaService.paginate<Order>(this.prisma.order, paginateOptions, {
      where: {
        userId,
      },
    })

    return paginatedResult
  }

  async userUpdate(id: string, data: UserUpdateOrderDto) {
    const updatedItem = await this.prisma.order
      .update({
        where: {
          id,
        },
        data: {
          ...excludeFromObject(data, ['email', 'name']),

          ...(data.structureFeatures && {
            structureFeatures: {
              connect: data.structureFeatures.map((e) => ({ id: e })),
            },
          }),
        },
      })
      .catch((err) => {
        throw new HandleException('Could not update', 400, err)
      })

    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: updatedItem.userId,
      },
    })

    if (foundUser) {
      await this.prisma.user
        .update({
          where: {
            id: updatedItem.userId,
          },
          data: {
            name: data.name,
            email: foundUser.email || data.email,
          },
        })
        .catch(() => {})
    }

    const suggestedStructure = await this.structureService.suggestStructure(data)

    return {
      status: 'SUCCESS',
      message: 'order updated successfully',
      id: updatedItem.id,
      suggestedStructure,
    }
  }

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
