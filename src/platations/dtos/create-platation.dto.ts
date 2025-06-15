import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreatePlatationDto {
  @ApiProperty({
    description: 'ID da fazenda (referência)',
    example: 'f6e5d4c3-b2a1-0987-6543-210fedcba987',
  })
  @IsUUID()
  @IsNotEmpty()
  farm_id: string

  @ApiProperty({
    description: 'ID da cultura (referência)',
    example: 'f6e5d4c3-b2a1-0987-6543-210fedcba987',
  })
  @IsUUID()
  @IsNotEmpty()
  crop_id: string

  @ApiProperty({
    description: 'ID da safra (referência)',
    example: 'f6e5d4c3-b2a1-0987-6543-210fedcba987',
  })
  @IsUUID()
  @IsNotEmpty()
  harvest_id: string
}
