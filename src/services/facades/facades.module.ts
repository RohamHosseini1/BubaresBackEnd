import { Module } from '@nestjs/common'
import { FacadesService } from './facades.service'
import { S3ClientService } from '../s3-client/s3-client.service'
import { FacadeController } from './facades.controller'

@Module({
  controllers: [FacadeController],

  providers: [FacadesService, S3ClientService],
})
export class FacadesModule {}
