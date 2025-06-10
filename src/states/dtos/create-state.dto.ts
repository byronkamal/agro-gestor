import { IsString, IsNotEmpty, IsUppercase, Length } from 'class-validator'

export class CreateStateDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Length(2, 2)
  acronym: string
}
