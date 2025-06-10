import { IsNotEmpty, IsUUID } from 'class-validator'

export class CreatePlatationDto {
  @IsUUID()
  @IsNotEmpty()
  farm_id: string

  @IsUUID()
  @IsNotEmpty()
  crop_id: string

  @IsUUID()
  @IsNotEmpty()
  harvest_id: string
}
