import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { S3ClientService } from '../s3-client/s3-client.service'
import { HandleException } from 'helpers/handle.exception'

@Injectable()
export class FacadesService {
  constructor(
    private prisma: PrismaService,
    private readonly s3ClientService: S3ClientService,
  ) {}

  async getRandomFacade() {
    const facadesCount = await this.prisma.facade.count()

    if (facadesCount === 0) throw new HandleException('No facades available.', 404)

    const randomSkip = Math.round(Math.random() * (facadesCount - 1))

    const foundFacade = this.prisma.facade
      .findMany({
        take: 1,
        skip: randomSkip,
      })
      .catch((err) => {
        throw new HandleException('Could not find a random facade', 500, err)
      })

    return foundFacade
  }

  async findOne(id: string) {
    const foundFacade = this.prisma.facade
      .findUniqueOrThrow({
        where: {
          id: id as any,
        },
      })
      .catch((err) => {
        throw new HandleException('No Facade found with the given id.', 404, err)
      })

    return foundFacade
  }

  async remove(id: string) {
    const deletedItem = await this.prisma.facade
      .delete({
        where: {
          id,
        },
      })
      .catch((err) => {
        throw new HandleException('Could not delete', 500, err)
      })

    Promise.allSettled([
      this.s3ClientService.deleteFacadeData(
        {
          type: 'MODEL',
          key: deletedItem.modelKey,
        },
        false,
      ),
      this.s3ClientService.deleteFacadeData(
        {
          type: 'THUMBNAIL',
          key: deletedItem.thumbnailKey,
        },
        false,
      ),
    ]).then()

    return `This action removes a #${id} facade`
  }
}
