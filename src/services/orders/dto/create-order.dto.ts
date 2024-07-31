import { IsArray, IsInt, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateOrderDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  sendInterval: number

  @IsPositive()
  @IsInt()
  @IsOptional()
  minDueDays: number

  @IsString()
  @IsOptional()
  targetDeadlineField: string

  @IsString()
  @IsOptional()
  targetItemName: string

  @MaxLength(10, { each: true })
  @MinLength(10, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  assignees?: string[]
}
