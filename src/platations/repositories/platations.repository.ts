import { Platation } from '../entities/platation.entity'
import { CreatePlatationDto } from '../dtos/create-platation.dto'
import { UpdatePlatationDto } from '../dtos/update-platation.dto'

export abstract class IPlatationsRepository {
  abstract create(data: CreatePlatationDto): Promise<Platation>
  abstract findAll(): Promise<Platation[]>
  abstract findById(id: string): Promise<Platation | null>
  abstract findByUniqueKeys(
    farm_id: string,
    crop_id: string,
    harvest_id: string,
  ): Promise<Platation | null>

  abstract update(id: string, data: UpdatePlatationDto): Promise<Platation>
  abstract remove(id: string): Promise<void>
}
