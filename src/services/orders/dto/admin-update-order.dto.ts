import { PartialType } from '@nestjs/swagger'
import { AdminCreateOrderDto } from './admin-create-order.dto'

export class AdminUpdateOrderDto extends PartialType(AdminCreateOrderDto) {}
