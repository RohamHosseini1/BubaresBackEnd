import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateStructureDto } from './dto/create-structure.dto'
import { UpdateStructureDto } from './dto/update-structure.dto'
import { S3ClientService } from '../s3-client/s3-client.service'
import { FacadesService } from '../facades/facades.service'

@Injectable()
export class StructureService {
  constructor(
    private prisma: PrismaService,
    private readonly s3ClientService: S3ClientService,
    private readonly facadeService: FacadesService,
  ) {}

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
          ...(data.structureFeatures && {
            structureFeatures: {
              connect: data.structureFeatures.map((e) => ({ id: e })),
            },
          }),
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
    return await this.prisma.structure.findMany({
      include: {
        structureFeatures: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        facades: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
        materials: {
          select: {
            id: true,
            material: {
              omit: {
                createdAt: true,
                updatedAt: true,
              },
            },
            quantity: true,
          },
        },
      },
    })
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

  async findOne(id: number) {
    const foundStructure = await this.prisma.structure
      .findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          structureFeatures: {
            omit: {
              createdAt: true,
              updatedAt: true,
            },
          },
          facades: {
            omit: {
              createdAt: true,
              updatedAt: true,
            },
          },
          materials: {
            select: {
              id: true,
              material: {
                omit: {
                  createdAt: true,
                  updatedAt: true,
                },
              },
              quantity: true,
            },
          },
        },
      })
      .catch((err) => {
        throw new HandleException('Could not find the item with the given id', 500, err)
      })

    return foundStructure
  }

  async remove(id: number) {
    // delete from structureMaterial
    await this.prisma.structureMaterial
      .deleteMany({
        where: {
          structureId: id,
        },
      })
      .catch(() => {})

    // delete from facades
    const foundStructure = await this.findOne(id)
    for (const facade of foundStructure.facades) {
      await this.facadeService.remove(facade.id)
    }

    // delete the structure itself
    const deletedItem = await this.prisma.structure
      .delete({
        where: {
          id,
        },
        include: { facades: true },
      })
      .catch((err) => {
        throw new HandleException('Could not delete', 500, err)
      })

    return deletedItem
  }
}
