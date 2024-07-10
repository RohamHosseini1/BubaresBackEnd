import { FAQCategory } from '@prisma/client'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator'

export class CreateFAQDto {
  @IsEnum(FAQCategory)
  category: FAQCategory

  @MinLength(5)
  @IsString()
  question: string

  @MinLength(5)
  @IsString()
  answer: string

  @MinLength(3)
  @IsString()
  @IsOptional()
  linkText?: string

  @MinLength(1)
  @IsString()
  @IsOptional()
  linkHref?: string

  @IsPositive()
  @IsInt()
  @IsOptional()
  position: number

  @IsBoolean()
  @IsOptional()
  featured?: boolean
}
