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
    const currentMaterials = await this.prisma.material.findMany()
    let createdRecords = 0
    let updatedRecords = 0

    for (const item of data) {
      if (!item.id) {
        await this.prisma.material
          .create({ data: item })
          .then(() => {
            createdRecords++
          })
          .catch((err) => {
            throw new HandleException('Could not create the material record.', 500, err)
          })
      } else {
        const foundCurrentMaterial = currentMaterials.find((e) => e.id === item.id)

        if (foundCurrentMaterial && isEqual(foundCurrentMaterial, item)) continue

        await this.prisma.material
          .update({ where: { id: item.id }, data: item })
          .then(() => {
            updatedRecords++
          })
          .catch(() => {})
      }
    }

    return { status: 'SUCCESS', createdRecords, updatedRecords }
  }

  async findAll() {
    return await this.prisma.material.findMany()
  }

  async update(id: number, data: UpdateMaterialDto) {
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
