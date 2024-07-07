import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { AuthGuard } from './guards/auth.guard'

// modules
import { PrismaModule } from './prisma/prisma.module'
import { ResponseLoggerInterceptor } from './services/my-logger/my-logger.service'
import { UsersModule } from './services/users/users.module'
import { AttachmentsModule } from './services/attachments/attachments.module'
// import { AlarmRulesModule } from './services/boilerplate/boilerplate.module'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    PrismaModule,
    UsersModule,
    AttachmentsModule,
    // AlarmRulesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseLoggerInterceptor,
    },
  ],
})
export class AppModule {}
