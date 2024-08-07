import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { StructureService } from '../structures/structure.service'
import { S3ClientService } from '../s3-client/s3-client.service'
import { FacadesService } from '../facades/facades.service'

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, StructureService, S3ClientService, FacadesService],
})
export class OrderModule {}
