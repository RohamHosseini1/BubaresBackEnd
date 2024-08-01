import { Injectable } from '@nestjs/common'
import { Structure } from '@prisma/client'
import { HandleException } from 'helpers/handle.exception'
import { excludeFromObject } from 'helpers/utils'
import isEqual from 'lodash/isEqual'
import { PaginateOptions, PrismaService } from 'src/prisma/prisma.service'
import { FacadesService } from '../facades/facades.service'
import { UserCreateOrderDto } from '../orders/dto/user-create-order.dto'
import { UserUpdateOrderDto } from '../orders/dto/user-update-order.dto'
import { S3ClientService } from '../s3-client/s3-client.service'
import { CreateStructureDto } from './dto/create-structure.dto'
import { UpdateStructureDto } from './dto/update-structure.dto'

@Injectable()
export class StructureService {
  constructor(
    private prisma: PrismaService,
    private readonly s3ClientService: S3ClientService,
    private readonly facadeService: FacadesService,
  ) {}

  async suggestStructure(data: Partial<UserCreateOrderDto & UserUpdateOrderDto>) {
    const result = await this.prisma.structure.findMany()

    // if (data.application) {
    //   result = result.filter((e) => e.application)
    // }

    return result[0]
  }

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

  async findAll(paginateOptions: PaginateOptions) {
    const paginatedResult = await PrismaService.paginate<Structure>(this.prisma.structure, paginateOptions, {
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

    return paginatedResult
  }

  async handleUpdateStructureMaterials(item: Awaited<ReturnType<typeof this.findOne>>, data: UpdateStructureDto) {
    const { materials: currentMaterials, id: currentStructureId } = item
    const { materials: incomingMaterials } = data
    const modifications = {
      created: 0,
      updated: 0,
    }

    for (const materialObj of incomingMaterials) {
      if (!materialObj.id) {
        // if an item does not have id, it means it's new
        modifications.created++

        await this.prisma.structureMaterial.create({
          data: {
            ...materialObj,
            structureId: currentStructureId,
          },
        })
      } else {
        // check if old and new items area identical => don't update
        const foundCurrentItem = currentMaterials.find((e) => e.id === materialObj.id)

        if (foundCurrentItem) {
          const normalizedCurrentItem = {
            ...excludeFromObject(foundCurrentItem, ['material']),
            materialId: foundCurrentItem.material.id,
          }

          if (isEqual(normalizedCurrentItem, materialObj)) continue
        }

        // update if any difference is detected
        modifications.updated++
        await this.prisma.structureMaterial.update({
          where: {
            id: materialObj.id,
          },
          data: materialObj,
        })
      }
    }

    return modifications
  }

  async handleUpdateStructureFacades(item: Awaited<ReturnType<typeof this.findOne>>, data: UpdateStructureDto) {
    const { facades: currentFacades, id: currentStructureId } = item
    const { facades: incomingFacades } = data
    const modifications = {
      created: 0,
      updated: 0,
      oldThumbnailDeleted: {},
      oldModelDeleted: {},
    }

    for (const facadeObj of incomingFacades) {
      if (!facadeObj.id) {
        // if an item does not have id, it means it's new
        modifications.created++

        await this.prisma.facade.create({
          data: {
            ...facadeObj,
            structureId: currentStructureId,
          },
        })
      } else {
        // check if old and new items area identical => don't update
        const foundCurrentItem = currentFacades.find((e) => e.id === facadeObj.id)

        if (foundCurrentItem) {
          const normalizedCurrentItem = {
            ...foundCurrentItem,
          }

          if (isEqual(normalizedCurrentItem, facadeObj)) continue
        }

        // update if any difference is detected
        modifications.updated++
        await this.prisma.facade.update({
          where: {
            id: foundCurrentItem.id,
          },
          data: facadeObj,
        })

        // delete old object from the bucket if any change is detected
        const promiseDeleteThumbnail =
          foundCurrentItem.thumbnailKey !== facadeObj.thumbnailKey
            ? this.s3ClientService.deleteFacadeData({ key: foundCurrentItem.thumbnailKey }, false)
            : Promise.resolve({})

        const promiseDeleteModel =
          foundCurrentItem.modelKey !== facadeObj.modelKey
            ? this.s3ClientService.deleteFacadeData({ key: foundCurrentItem.modelKey }, false)
            : Promise.resolve({})

        const result = await Promise.all([promiseDeleteThumbnail, promiseDeleteModel])
        modifications.oldThumbnailDeleted = result[0]
        modifications.oldModelDeleted = result[1]
      }
    }

    return modifications
  }

  async update(id: number, data: UpdateStructureDto) {
    const foundItem = await this.findOne(id)
    const metadata: {
      materials?: Awaited<ReturnType<typeof this.handleUpdateStructureMaterials>>
      facades?: Awaited<ReturnType<typeof this.handleUpdateStructureFacades>>
    } = {}

    if (data.materials) metadata.materials = await this.handleUpdateStructureMaterials(foundItem, data)
    if (data.facades) metadata.facades = await this.handleUpdateStructureFacades(foundItem, data)

    const updatedItem = await this.prisma.structure
      .update({
        where: {
          id,
        },
        data: {
          ...excludeFromObject(data, ['facades', 'materials']),

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

    return {
      updatedItem,
      metadata,
    }
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
              structureId: true,
            },
          },
          materials: {
            select: {
              id: true,
              quantity: true,
              materialId: true,
              material: {
                omit: {
                  createdAt: true,
                  updatedAt: true,
                },
              },
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
