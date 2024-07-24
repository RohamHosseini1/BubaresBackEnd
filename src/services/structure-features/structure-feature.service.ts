import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateStructureFeatureDto } from './dto/create-structure-feature.dto'
import { UpdateStructureFeatureDto } from './dto/update-structure-features.dto'

@Injectable()
export class StructureFeatureService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStructureFeatureDto) {
    const createdItem = await this.prisma.structureFeature
      .create({
        data,
      })
      .catch((err) => {
        throw new HandleException('Could not create.', 400, err)
      })

    return createdItem
  }

  async findAll() {
    return await this.prisma.structureFeature.findMany()
  }

  async update(id: number, data: UpdateStructureFeatureDto) {
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
