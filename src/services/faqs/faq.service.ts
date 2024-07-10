import { Injectable } from '@nestjs/common'
import { HandleException } from 'helpers/handle.exception'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateFAQDto } from './dto/create-faq.dto'
import { UpdateFAQDto } from './dto/update-faq.dto'

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFAQDto) {
    // get next available position number
    const {
      _max: { position: maxPosition },
    } = await this.prisma.fAQ.aggregate({
      _max: {
        position: true,
      },
    })

    // check if data.position has the correct value
    if (!data.position) {
      data.position = maxPosition + 1
    } else {
      const foundDuplicateItem = await this.prisma.fAQ.findUnique({
        where: {
          position: data.position,
        },
      })

      if (foundDuplicateItem)
        throw new HandleException('Duplicate Position.', 400, { nextAvailablePosition: maxPosition + 1 })
    }

    // perform the creation
    const createdItem = await this.prisma.fAQ
      .create({
        data,
      })
      .catch((err) => {
        throw new HandleException('Could not create.', 400, err)
      })

    return createdItem
  }

  async findAll() {
    return await this.prisma.fAQ.findMany()
  }

  async update(id: number, data: UpdateFAQDto) {
    const updatedItem = await this.prisma.fAQ
      .update({
        where: {
          id,
        },
        data,
      })
      .catch((err) => {
        throw new HandleException('Could not update', 400, err)
      })

    return updatedItem
  }

  async remove(id: number) {
    const deletedItem = await this.prisma.fAQ
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
