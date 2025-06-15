import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator'

export class CreateHarvestDto {
  @ApiProperty({
    description: 'Nome da safra',
    example: 'Safra 2024',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Ano da safra',
    example: 2024,
  })
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number
}
