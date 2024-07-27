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

  async remove(id: number) {
    const deletedItem = await this.prisma.facade
      .delete({
        where: {
          id,
        },
      })
      .catch((err) => {
        throw new HandleException('Could not delete', 500, err)
      })

    this.s3ClientService.deleteFacadeData(
      {
        type: 'MODEL',
        key: deletedItem.modelKey,
      },
      false,
    )
    this.s3ClientService.deleteFacadeData(
      {
        type: 'THUMBNAIL',
        key: deletedItem.thumbnailKey,
      },
      false,
    )

    return `This action removes a #${id} facade`
  }
}
