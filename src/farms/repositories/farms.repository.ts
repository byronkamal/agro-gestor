import { Farm } from '../entities/farm.entity'
import { CreateFarmDto } from '../dtos/create-farm.dto'
import { UpdateFarmDto } from '../dtos/update-farm.dto'

export abstract class IFarmsRepository {
  abstract create(data: CreateFarmDto): Promise<Farm>
  abstract findAll(): Promise<Farm[]>
  abstract findById(id: string): Promise<Farm | null>
  abstract update(id: string, data: UpdateFarmDto): Promise<Farm>
  abstract remove(id: string): Promise<void>
}
