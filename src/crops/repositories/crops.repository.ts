import { Crop } from '../entities/crop.entity'
import { CreateCropDto } from '../dtos/create-crop.dto'
import { UpdateCropDto } from '../dtos/update-crop.dto'

export abstract class ICropsRepository {
  abstract create(data: CreateCropDto): Promise<Crop>
  abstract findAll(): Promise<Crop[]>
  abstract findById(id: string): Promise<Crop | null>
  abstract findByName(name: string): Promise<Crop | null>
  abstract update(id: string, data: UpdateCropDto): Promise<Crop>
  abstract remove(id: string): Promise<void>
}
