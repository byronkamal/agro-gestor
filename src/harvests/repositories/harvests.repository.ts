import { Harvest } from '../entities/harvest.entity'
import { CreateHarvestDto } from '../dtos/create-harvest.dto'
import { UpdateHarvestDto } from '../dtos/update-harvest.dto'

export abstract class IHarvestsRepository {
  abstract create(data: CreateHarvestDto): Promise<Harvest>
  abstract findAll(): Promise<Harvest[]>
  abstract findById(id: string): Promise<Harvest | null>
  abstract update(id: string, data: UpdateHarvestDto): Promise<Harvest>
  abstract remove(id: string): Promise<void>
}
