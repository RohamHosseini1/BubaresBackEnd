import { Module } from '@nestjs/common'
import { BlogPostsService } from './blog-posts.service'
import { BlogPostsController } from './blog-posts.controller'
import { S3ClientService } from '../s3-client/s3-client.service'

@Module({
  controllers: [BlogPostsController],
  providers: [BlogPostsService, S3ClientService],
})
export class BlogPostsModule {}
