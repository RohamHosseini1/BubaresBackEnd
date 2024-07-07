import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import detectEnvVarsNotSet from 'helpers/check-env-vars'
import { initDailyCronJob } from './cron-jobs/daily'

async function bootstrap() {
  // check for existence of required env vars
  if (detectEnvVarsNotSet())
    throw new Error(`Missing environment variables. Have you forgotten to set your environment variables correctly?`)

  // create nest factory app
  const app = await NestFactory.create(AppModule)

  // global /api/...
  app.setGlobalPrefix('api')

  // global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  )

  // set cors headers
  const isDevelopmentEnv = process.env.NODE_ENV === 'development'
  const corsAllowOrigins = isDevelopmentEnv ? '*' : process.env.CORS_ALLOW_ORIGINS.split(',')

  app.enableCors({
    origin: corsAllowOrigins,
  })
  // ---

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Bubares')
    .setDescription('Bubares backend API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
  // ---

  // serialize BigInt (prisma: Do not know how to serialize a BigInt)
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString())
    return int ?? this.toString()
  }
  // ---

  // cron jobs
  initDailyCronJob()
  // ---

  await app.listen(process.env.PORT)
}

bootstrap()
