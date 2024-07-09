import { IsInt, IsPositive, IsString, Max, Min } from 'class-validator'

export class LoginDto {
  @IsString()
  phone: string

  @Max(999999)
  @Min(100000)
  @IsPositive()
  @IsInt()
  code: number
}
