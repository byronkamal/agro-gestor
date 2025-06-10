import { IsString, IsNotEmpty, IsNumber, Min, IsUUID } from 'class-validator'
import { BadRequestException } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class CreateFarmDto {
  @ApiProperty({
    description: 'Área total da fazenda em hectares',
    example: 1000.5,
  })
  @IsNumber()
  @Min(0)
  total_area: number

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda Esperança',
  })
  @IsString()
  @IsNotEmpty()
  farm_name: string

  @ApiProperty({
    description: 'Área de vegetação da fazenda em hectares',
    example: 200.0,
  })
  @IsNumber()
  @Min(0)
  vegetation_area: number

  @ApiProperty({
    description: 'Área agricultável da fazenda em hectares',
    example: 500.5,
  })
  @IsNumber()
  @Min(0)
  agricultural_area: number

  @ApiProperty({
    description: 'ID da cidade onde a fazenda está localizada',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  city_id: string

  @ApiProperty({
    description: 'ID do produtor rural proprietário da fazenda',
    example: 'f6e5d4c3-b2a1-0987-6543-210fedcba987',
  })
  @IsUUID()
  @IsNotEmpty()
  producer_id: string

  validate() {
    if (this.vegetation_area + this.agricultural_area > this.total_area) {
      throw new BadRequestException(
        'A soma das áreas de vegetação e agricultável não pode exceder a área total da fazenda.',
      )
    }
  }
}
