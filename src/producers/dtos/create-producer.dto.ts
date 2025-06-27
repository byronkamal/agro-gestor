import { IsString, IsNotEmpty, IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProducerDto {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor rural',
    example: '123.456.789-00',
  })
  @IsString()
  @IsNotEmpty()
  document: string

  @ApiProperty({
    description: 'Nome do produtor rural',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Tipo de documento (CPF ou CNPJ)',
    example: 'CPF',
    enum: ['CPF', 'CNPJ'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['CPF', 'CNPJ'])
  document_type: string
}
