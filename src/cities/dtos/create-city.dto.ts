import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsUUID } from 'class-validator'

export class CreateCityDto {
  @ApiProperty({
    description: 'Nome da cidade',
    example: 'Rio de Janeiro',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Referência ao estado (UUID)',
    example: 'e19f09fa-084d-4509-9b9d-9af2b17cd467',
  })
  @IsUUID()
  @IsNotEmpty()
  state_id: string
}
