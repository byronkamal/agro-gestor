import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateCropDto {
  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Arroz, feijão, soja',
  })
  @IsString()
  @IsNotEmpty()
  name: string
}
