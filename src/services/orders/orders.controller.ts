import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Public } from 'src/guards/auth.guard'
import { IsAdminGuard } from 'src/guards/is-admin.guard'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @Post()
  // @UseGuards(IsAdminGuard)
  // adminCreate(@Body() input: CreateOrderDto) {
  //   return this.ordersService.adminCreate(input)
  // }

  @Get()
  @UseGuards(IsAdminGuard)
  adminFindAll(@Query('page') page: string, @Query('perPage') perPage: string) {
    const paginateOptions = { page, perPage }

    return this.ordersService.adminFindAll(paginateOptions)
  }

  // @Post('/me')
  // @Public()
  // userCreate(@Body() input: CreateOrderDto) {
  //   return this.ordersService.userCreate(input)
  // }

  @Get('/me')
  userFindAll(@Req() request: Request, @Query('page') page: string, @Query('perPage') perPage: string) {
    if (!request.user) return new UnauthorizedException()

    const paginateOptions = { page, perPage }

    return this.ordersService.userFindAll(request.user.id, paginateOptions)
  }

  // @Patch(':id')
  // @UseGuards(IsAdminGuard)
  // adminUpdate(@Param('id') id: string, @Body() input: UpdateOrderDto) {
  //   return this.ordersService.adminUpdate(+id, input)
  // }

  @Delete(':id')
  @UseGuards(IsAdminGuard)
  adminRemove(@Param('id') id: string) {
    return this.ordersService.adminRemove(+id)
  }

  // @Patch('/me/:id')
  // @Public()
  // userUpdate(@Param('id') id: string, @Body() input: UpdateOrderDto) {
  //   return this.ordersService.userUpdate(+id, input)
  // }

  @Delete('/me/:id')
  userRemove(@Req() request: Request, @Param('id') id: string) {
    if (!request.user) return new UnauthorizedException()

    return this.ordersService.userRemove(request.user.id, +id)
  }

  // @ApiOperation({ summary: 'Manually send alarms based on all Orders' })
  // @UseGuards(IsAdminGuard)
}
