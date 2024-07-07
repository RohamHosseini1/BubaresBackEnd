import { Injectable } from '@nestjs/common'
import * as moment from 'moment-jalaali'
import { PrismaService } from './prisma/prisma.service'

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  jalaaliToGregorian(jDate: string) {
    let sanitized = jDate.split(' ')[0]
    if (!sanitized) sanitized = '1900-01-01'

    return moment(sanitized, 'jYYYY/jMM/jDD').utc().startOf('day').toISOString()
  }

  getHello(): string {
    return 'Hello World!'
  }
}
