import { Controller, Delete, Param } from '@nestjs/common'
import { AttachmentsService } from './attachments.service'

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attachmentsService.remove(+id)
  }
}
