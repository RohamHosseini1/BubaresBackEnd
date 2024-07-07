import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AttachmentsService {
  private readonly s3Client = new S3Client({
    region: 'default',
    endpoint: process.env.LIARA_ENDPOINT,
    credentials: {
      accessKeyId: process.env.LIARA_ACCESS_KEY,
      secretAccessKey: process.env.LIARA_SECRET_KEY,
    },
  })

  constructor(private prisma: PrismaService) {}

  async remove(id: number) {
    // find target attachment
    const foundAttachment = await this.prisma.attachment
      .findUniqueOrThrow({
        where: {
          id,
        },
      })
      .catch((err) => {
        throw new HandleException('Attachment with the given id does not exist.', 400, err)
      })

    // remove from bucket
    await this.s3Client
      .send(
        new DeleteObjectCommand({
          Bucket: process.env.LIARA_BUCKET_NAME,
          Key: foundAttachment.key,
        }),
      )
      .catch((err) => {
        throw new HandleException('Error deleting file from the bucket.', 500, err)
      })

    // remove from database
    await this.prisma.attachment.delete({
      where: {
        id,
      },
    })

    return {
      message: 'Attachment deleted successfully!',
      ...foundAttachment,
    }
  }
}
