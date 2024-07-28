import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateMaterialDto } from './dto/create-material.dto'
import { UpdateMaterialDto } from './dto/update-material.dto'
import isEqual from 'lodash/isEqual'

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMaterialDto) {
    if (data.id) delete data.id

    const createdItem = await this.prisma.material
      .create({
        data,
      })
      .catch((err) => {
        throw new HandleException('Could not create.', 400, err)
      })

    return createdItem
  }

  async bulkCreate(data: CreateMaterialDto[]) {
    const currentItems = await this.findAll()
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
        if (foundCurrentItem && isEqual(foundCurrentItem, item)) continue

        // update if any difference is detected
        await this.update(item.id, item)
        updatedRecords++
      }
    }

    return { status: 'SUCCESS', createdRecords, updatedRecords }
  }

  async findAll() {
    return await this.prisma.material.findMany()
  }

  async update(id: number, data: UpdateMaterialDto) {
    delete data.id

    const updatedItem = await this.prisma.material
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
    const deletedItem = await this.prisma.material
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
