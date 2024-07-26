import { Module } from '@nestjs/common'
import { StructureService } from './structure.service'
import { StructureController } from './structure.controller'
import { S3ClientService } from '../s3-client/s3-client.service'

@Module({
  controllers: [StructureController],
  providers: [StructureService, S3ClientService],
})
export class StructureModule {}
