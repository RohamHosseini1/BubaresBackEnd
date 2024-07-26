import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateStructureDto } from './dto/create-structure.dto'
import { UpdateStructureDto } from './dto/update-structure.dto'

@Injectable()
export class StructureService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStructureDto) {
    const createdItem = await this.prisma.structure
      .create({
        data: {
          ...data,
          materials: {
            createMany: {
              data: data.materials,
            },
          },
          structureFeatures: {
            connect: data.structureFeatures.map((e) => ({ id: e })),
          },
          facades: {
            createMany: {
              data: data.facades,
            },
          },
        },
      })
      .catch((err) => {
        throw new HandleException('Could not create the structure.', 400, err)
      })

    return createdItem
  }

  async findAll() {
    return await this.prisma.structure.findMany()
  }

  async update(id: number, data: UpdateStructureDto) {
    // const updatedItem = await this.prisma.structure
    //   .update({
    //     where: {
    //       id,
    //     },
    //     data,
    //   })
    //   .catch((err) => {
    //     throw new HandleException('Could not update', 500, err)
    //   })

    // return updatedItem

    return data
  }

  async remove(id: number) {
    const deletedItem = await this.prisma.structure
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
