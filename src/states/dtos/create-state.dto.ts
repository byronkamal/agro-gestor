import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsUppercase, Length } from 'class-validator'

export class CreateStateDto {
  @ApiProperty({
    description: 'Nome da estado',
    example: 'Minas Gerais',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Sigla do estafo',
    example: 'MG',
  })
  @IsString()
  @IsNotEmpty()
  @IsUppercase()
  @Length(2, 2)
  acronym: string
}
