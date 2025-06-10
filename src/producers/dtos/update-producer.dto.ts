import { PartialType } from '@nestjs/mapped-types'
import { CreateProducerDto } from './create-producer.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsIn } from 'class-validator'

export class UpdateProducerDto extends PartialType(CreateProducerDto) {
  @ApiProperty({
    description: 'CPF ou CNPJ do produtor rural',
    example: '123.456.789-00',
    required: false,
  })
  @IsOptional()
  @IsString()
  document?: string

  @ApiProperty({
    description: 'Nome do produtor rural',
    example: 'João da Silva',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({
    description: 'Tipo de documento (CPF ou CNPJ)',
    example: 'CPF',
    enum: ['CPF', 'CNPJ'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['CPF', 'CNPJ'])
  document_type?: 'CPF' | 'CNPJ'
}
