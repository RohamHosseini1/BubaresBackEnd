import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PaginateOptions, PrismaService } from 'src/prisma/prisma.service'
import { CreateStructureFeatureDto } from './dto/create-structure-feature.dto'
import { UpdateStructureFeatureDto } from './dto/update-structure-features.dto'
import { isEqual } from 'lodash'
import { Prisma, StructureFeature } from '@prisma/client'

@Injectable()
export class StructureFeatureService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStructureFeatureDto) {
    delete data.id

    const createdItem = await this.prisma.structureFeature
      .create({
        data,
      })
      .catch((err) => {
        throw new HandleException('Could not create.', 400, err)
      })

    return createdItem
  }

  async bulkCreate(data: CreateStructureFeatureDto[]) {
    const currentItems = await this.prisma.structureFeature.findMany()
    let createdRecords = 0
    let updatedRecords = 0

    for (const item of data) {
      if (!item.id) {
        // if an item does not have id, it means it's new
        await this.create(item)
        createdRecords++
      } else {
        // check if old and new items area identical => don't update
        const foundCurrentItem = currentItems.find((e) => e.id === item.id)
        if (foundCurrentItem) {
          delete foundCurrentItem.createdAt
          delete foundCurrentItem.updatedAt

          const normalizedCurrentItem = {
            ...foundCurrentItem,
            unitPrice: Number(foundCurrentItem.unitPrice),
          }

          if (isEqual(normalizedCurrentItem, item)) continue
        }

        // update if any difference is detected
        await this.update(item.id, item)
        updatedRecords++
      }
    }

    return { status: 'SUCCESS', createdRecords, updatedRecords }
  }

  async findAll(paginateOptions?: PaginateOptions | undefined) {
    const findManyArgs: Prisma.StructureFeatureFindManyArgs = {}

    // with pagination
    if (paginateOptions?.page || paginateOptions?.perPage)
      return PrismaService.paginate<StructureFeature>(this.prisma.structureFeature, paginateOptions, findManyArgs)

    // without pagination
    findManyArgs.take = 20
    return await this.prisma.structureFeature.findMany(findManyArgs)
  }

  async update(id: number, data: UpdateStructureFeatureDto) {
    delete data.id

    const updatedItem = await this.prisma.structureFeature
      .update({
        where: {
          id,
        },
        data,
      })
      .catch((err) => {
        throw new HandleException('Could not update', 500, err)
      })

    return updatedItem
  }

  async remove(id: number) {
    const deletedItem = await this.prisma.structureFeature
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
}
