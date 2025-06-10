import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator'

export class CreateHarvestDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number
}
