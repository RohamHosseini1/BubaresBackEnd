// import { Injectable } from '@nestjs/common'
// import { HandleException } from 'helpers/handle.exception'
// import { PrismaService } from 'src/prisma/prisma.service'

// @Injectable()
// export class BoilerplateService {
//   constructor(private prisma: PrismaService) {}

//   async create(data: CreateBoilerPlateDto) {
//     const createdItem = await this.prisma.boilerplate
//       .create({
//         data,
//       })
//       .catch((err) => {
//         throw new HandleException('Could not create.', 400, err)
//       })

//     return createdItem
//   }

//   async findAll() {
//     return await this.prisma.user.findMany()
//   }

//   async update(id: number, data: UpdateBoilerPlateDto) {
//     const updatedItem = await this.prisma.boilerplate
//       .update({
//         where: {
//           id,
//         },
//         data,
//       })
//       .catch((err) => {
//         throw new HandleException('Could not update', 500, err)
//       })

//     return updatedItem
//   }

//   async remove(id: number) {
//     const deletedItem = await this.prisma.boilerplate
//       .delete({
//         where: {
//           id,
//         },
//       })
//       .catch((err) => {
//         throw new HandleException('Could not delete', 500, err)
//       })

//     return deletedItem
//   }
// }
