import { Module } from '@nestjs/common'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { AuthGuard } from './guards/auth.guard'
import { ResponseLoggerInterceptor } from './services/my-logger/my-logger.service'

// modules
import { PrismaModule } from './prisma/prisma.module'
import { FaqModule } from './services/faqs/faq.module'
import { MaterialModule } from './services/materials/material.module'
import { StructureFeatureModule } from './services/structure-features/structure-feature.module'
import { StructureModule } from './services/structures/structure.module'
import { UsersModule } from './services/users/users.module'
import { FacadesModule } from './services/facades/facades.module'
import { BlogPostsModule } from './services/blog-posts/blog-posts.module'

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
    FaqModule,
    MaterialModule,
    StructureFeatureModule,
    StructureModule,
    FacadesModule,
    BlogPostsModule,
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
