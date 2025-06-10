import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { IFarmsRepository } from '../repositories/farms.repository'
import { CreateFarmDto } from '../dtos/create-farm.dto'
import { UpdateFarmDto } from '../dtos/update-farm.dto'
import { Farm } from '../entities/farm.entity'
import { ICitiesRepository } from '../../cities/repositories/cities.repository'

@Injectable()
export class FarmsService {
  constructor(
    private readonly farmsRepository: IFarmsRepository,
    private readonly citiesRepository: ICitiesRepository,
  ) {}

  private async validateCity(cityId: string): Promise<void> {
    const cityExists = await this.citiesRepository.findById(cityId)
    if (!cityExists) {
      throw new NotFoundException(`City with ID "${cityId}" not found`)
    }
  }

  private validateFarmAreas(
    totalArea: number,
    vegetationArea: number,
    agriculturalArea: number,
  ): void {
    if (vegetationArea + agriculturalArea > totalArea) {
      throw new BadRequestException(
        'A soma das áreas de vegetação e agricultável não pode exceder a área total da fazenda.',
      )
    }
  }

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    await this.validateCity(createFarmDto.city_id)
    this.validateFarmAreas(
      createFarmDto.total_area,
      createFarmDto.vegetation_area,
      createFarmDto.agricultural_area,
    )
    return this.farmsRepository.create(createFarmDto)
  }

  async findAll(): Promise<Farm[]> {
    return this.farmsRepository.findAll()
  }

  async findOne(id: string): Promise<Farm> {
    const farm = await this.farmsRepository.findById(id)
    if (!farm) {
      throw new NotFoundException(`Farm with ID "${id}" not found`)
    }
    return farm
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const existingFarm = await this.farmsRepository.findById(id)
    if (!existingFarm) {
      throw new NotFoundException(`Farm with ID "${id}" not found`)
    }

    if (updateFarmDto.city_id) {
      await this.validateCity(updateFarmDto.city_id)
    }

    const totalArea = updateFarmDto.total_area ?? existingFarm.total_area
    const vegetationArea =
      updateFarmDto.vegetation_area ?? existingFarm.vegetation_area
    const agriculturalArea =
      updateFarmDto.agricultural_area ?? existingFarm.agricultural_area

    this.validateFarmAreas(totalArea, vegetationArea, agriculturalArea)

    return this.farmsRepository.update(id, updateFarmDto)
  }

  async remove(id: string): Promise<void> {
    const existingFarm = await this.farmsRepository.findById(id)
    if (!existingFarm) {
      throw new NotFoundException(`Farm with ID "${id}" not found`)
    }
    await this.farmsRepository.remove(id)
  }
}
