import * as schedule from 'node-schedule'
import { PrismaService } from 'src/prisma/prisma.service'
import { ResponseLoggerInterceptor } from 'src/services/my-logger/my-logger.service'

export function initDailyCronJob() {
  schedule.scheduleJob('dailyCronJob', { tz: 'Iran', second: 1, minute: 30, hour: 23 }, async function () {
    const prismaService = new PrismaService()
    const logger = new ResponseLoggerInterceptor(prismaService)

    // delete old logs
    logger.deleteOldLogs()

    // log to check later to see if daily cron job is working
    logger.logToDb({
      type: 'CRON_JOB_DAILY',
      url: '',
      method: '',
      statusCode: 200,
      response: {},
    })
  })

  process.on('SIGINT', function () {
    schedule.gracefulShutdown().then(() => process.exit(0))
  })
}
