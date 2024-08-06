import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common'
import { BlogPostsService } from './blog-posts.service'
import { CreateBlogPostDto } from './dto/create-blog-post.dto'
import { UpdateBlogPostDto } from './dto/update-blog-post.dto'
import { IsAdminGuard } from 'src/guards/is-admin.guard'
import { ApiOperation } from '@nestjs/swagger'
import { S3ClientService } from '../s3-client/s3-client.service'
import { HandleException } from 'helpers/handle.exception'
import { Public } from 'src/guards/auth.guard'

@Controller('blog-posts')
export class BlogPostsController {
  constructor(
    private readonly blogPostsService: BlogPostsService,
    private readonly s3Client: S3ClientService,
  ) {}

  @Post()
  @UseGuards(IsAdminGuard)
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostsService.create(createBlogPostDto)
  }

  @Get()
  @Public()
  findAll(@Query('page') page: string, @Query('perPage') perPage: string) {
    const paginateOptions = { page, perPage }

    return this.blogPostsService.findAll(paginateOptions)
  }

  @ApiOperation({ summary: 'Getting the upload link of a Blog Image (blog thumbnail or body images)' })
  @Get('upload-facade-data-url')
  @UseGuards(IsAdminGuard)
  getUploadBlogImageUrl() {
    return this.s3Client.getUploadBlogImageUrl()
  }

  @Get('find-by-slug')
  @Public()
  findBySlug(@Body() input: { slug: string }) {
    if (!input.slug) return new HandleException('Property `slug` must be present.')

    return this.blogPostsService.findOne(input.slug, 'SLUG')
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogPostsService.findOne(id, 'ID')
  }

  @Patch(':id')
  @UseGuards(IsAdminGuard)
  update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogPostsService.update(+id, updateBlogPostDto)
  }

  @Delete(':id')
  @UseGuards(IsAdminGuard)
  remove(@Param('id') id: string) {
    return this.blogPostsService.remove(+id)
  }
}
