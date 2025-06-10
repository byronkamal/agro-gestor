import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { ICropsRepository } from '../repositories/crops.repository'
import { CreateCropDto } from '../dtos/create-crop.dto'
import { UpdateCropDto } from '../dtos/update-crop.dto'
import { Crop } from '../entities/crop.entity'

@Injectable()
export class CropsService {
  constructor(private readonly cropsRepository: ICropsRepository) {}

  async create(createCropDto: CreateCropDto): Promise<Crop> {
    const existingCrop = await this.cropsRepository.findByName(
      createCropDto.name,
    )
    if (existingCrop) {
      throw new ConflictException(
        `Crop with name "${createCropDto.name}" already exists`,
      )
    }
    return this.cropsRepository.create(createCropDto)
  }

  async findAll(): Promise<Crop[]> {
    return this.cropsRepository.findAll()
  }

  async findOne(id: string): Promise<Crop> {
    const crop = await this.cropsRepository.findById(id)
    if (!crop) {
      throw new NotFoundException(`Crop with ID "${id}" not found`)
    }
    return crop
  }

  async update(id: string, updateCropDto: UpdateCropDto): Promise<Crop> {
    const existingCrop = await this.cropsRepository.findById(id)
    if (!existingCrop) {
      throw new NotFoundException(`Crop with ID "${id}" not found`)
    }
    if (updateCropDto.name && updateCropDto.name !== existingCrop.name) {
      const cropWithSameName = await this.cropsRepository.findByName(
        updateCropDto.name,
      )
      if (cropWithSameName && cropWithSameName.id !== id) {
        throw new ConflictException(
          `Another crop with name "${updateCropDto.name}" already exists`,
        )
      }
    }
    return this.cropsRepository.update(id, updateCropDto)
  }

  async remove(id: string): Promise<void> {
    const existingCrop = await this.cropsRepository.findById(id)
    if (!existingCrop) {
      throw new NotFoundException(`Crop with ID "${id}" not found`)
    }
    await this.cropsRepository.remove(id)
  }
}
