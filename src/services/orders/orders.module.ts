import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { StructureService } from '../structures/structure.service'

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, StructureService],
})
export class OrderModule {}
