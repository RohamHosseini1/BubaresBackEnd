import { Body, Controller, Get, Param, Post, Req, UseGuards, Patch, HttpCode } from '@nestjs/common'
import { IsAdminGuard } from 'src/guards/is-admin.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginDto } from './dto/login.dto'
import { UsersService } from './users.service'
import { Public } from 'src/guards/auth.guard'
import { IsSuperAdminGuard } from 'src/guards/is-superadmin.guard'
import { AdminLoginDto } from './dto/admin-login.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  myInfo(@Req() request: Request) {
    return this.usersService.findOne(request.user.id)
  }

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @UseGuards(IsAdminGuard)
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @UseGuards(IsAdminGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id)
  }

  @Patch(':id')
  @UseGuards(IsSuperAdminGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Post('/login')
  @Public()
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.usersService.userLogin(loginDto)
  }

  @Post('/login/admin')
  @Public()
  @HttpCode(200)
  adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.usersService.adminLogin(adminLoginDto)
  }
}
