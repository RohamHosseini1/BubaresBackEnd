import { Transform } from 'class-transformer'
import {
  MinLength,
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  Validate,
  ArrayNotEmpty,
  IsArray,
  IsDefined,
} from 'class-validator'
import { IsValidBlogImageKey } from 'helpers/custom-validators'

export class CreateBlogPostDto {
  @Transform(({ value }) => value.replaceAll(' ', '-'))
  @MinLength(6)
  @IsString()
  slug: string

  @MinLength(3)
  @IsString()
  title: string

  @MinLength(10)
  @IsString()
  shortBody: string

  @MinLength(10)
  @IsString()
  body: string

  @IsPositive()
  @IsInt()
  authorId: number

  @Validate(IsValidBlogImageKey)
  @MinLength(3)
  @IsString()
  @IsOptional()
  thumbnail?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  ctaText?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  ctaBtnText?: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  ctaBtnHref?: string

  @IsString({ each: true })
  @IsDefined({ each: true })
  @ArrayNotEmpty()
  @IsArray()
  categories: string[]
}
