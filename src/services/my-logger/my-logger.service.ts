import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import moment from 'moment'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ResponseLoggerInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    return next.handle().pipe(
      // all successful requests => 2xx
      tap((data) => {
        if (['POST', 'PATCH', 'DELETE'].includes(request.method)) {
          this.logToDb({
            type: 'ACCESS',
            statusCode: response.statusCode,
            response: data,
            url: request.url,
            method: request.method,
            body: request.body,
            query: request.query,
            params: request.params,
            user: request.user,
            rawHeaders: request.rawHeaders,
          })
        }
      }),
      // all errors => 4xx, 5xx
      catchError((err) => {
        this.logToDb({
          type: 'ERROR',
          statusCode: err.status || err.statusCode || 500,
          response: err.response,
          url: request.url,
          method: request.method,
          body: request.body,
          query: request.query,
          params: request.params,
          user: request.user,
          rawHeaders: request.rawHeaders,
          error: err.stack || err,
        })

        return throwError(() => err)
      }),
    )
  }

  logToDb(data: Prisma.LogCreateInput) {
    // remove password
    if (data.body && 'password' in (data.body as any)) delete (data.body as any).password

    // save to database
    this.prisma.log
      .create({
        data,
      })
      .catch((err) => {
        console.error('could not log the response to the database', err)
      })
  }

  deleteOldLogs() {
    this.prisma.log
      .deleteMany({
        where: {
          createdAt: {
            lt: moment().subtract(3, 'months').toISOString(),
          },
        },
      })
      .catch((err) => {
        console.error('could not delete old logs', err)
      })
  }
}
