import { PartialType } from '@nestjs/mapped-types'
import { CreatePlatationDto } from './create-platation.dto'

export class UpdatePlatationDto extends PartialType(CreatePlatationDto) {}
