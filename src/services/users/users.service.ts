import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { HandleException } from 'helpers/handle.exception'
import { excludeFromObject } from 'helpers/utils'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10)

    const createdItem = await this.prisma.user
      .create({
        data: createUserDto,
        omit: {
          password: true,
        },
      })
      .catch((err) => {
        throw new HandleException('Could not create the user.', 400, err)
      })

    return createdItem
  }

  async findAll() {
    return await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    })
  }

  async findOne(id: User['id']) {
    const foundItem = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          id,
        },
        omit: {
          password: true,
        },
      })
      .catch(() => {
        throw new HandleException('User with given Id not found.', 404)
      })

    return foundItem
  }

  async update(id: User['id'], updateUserDto: UpdateUserDto | { confirmed: boolean }) {
    if ('password' in updateUserDto && updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)

    const updatedItem = await this.prisma.user
      .update({
        where: {
          id,
        },
        data: updateUserDto,
        omit: {
          password: true,
        },
      })
      .catch(() => {
        throw new HandleException('User with given Id not found.', 404)
      })

    return updatedItem
  }

  async returnUserInfoByCredentials(data: LoginDto) {
    const foundUser = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          email: data.email,
        },
        select: {
          id: true,
          role: true,

          // will be deleted later
          password: true,
        },
      })
      .catch(() => {
        throw new UnauthorizedException()
      })

    const passwordsMatch = await bcrypt.compare(data.password, foundUser.password)
    if (!passwordsMatch) throw new UnauthorizedException()

    const jwtPayload = excludeFromObject(foundUser, ['password'])

    const accessToken = await this.jwtService.signAsync(jwtPayload)

    return {
      user: jwtPayload,
      access: accessToken,
    }
  }
}
