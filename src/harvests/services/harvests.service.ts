import { Injectable, NotFoundException } from '@nestjs/common'
import { IHarvestsRepository } from '../repositories/harvests.repository'
import { CreateHarvestDto } from '../dtos/create-harvest.dto'
import { UpdateHarvestDto } from '../dtos/update-harvest.dto'
import { Harvest } from '../entities/harvest.entity'

@Injectable()
export class HarvestsService {
  constructor(private readonly harvestsRepository: IHarvestsRepository) {}

  async create(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    return this.harvestsRepository.create(createHarvestDto)
  }

  async findAll(): Promise<Harvest[]> {
    return this.harvestsRepository.findAll()
  }

  async findOne(id: string): Promise<Harvest> {
    const harvest = await this.harvestsRepository.findById(id)
    if (!harvest) {
      throw new NotFoundException(`Harvest with ID "${id}" not found`)
    }
    return harvest
  }

  async update(
    id: string,
    updateHarvestDto: UpdateHarvestDto,
  ): Promise<Harvest> {
    const existingHarvest = await this.harvestsRepository.findById(id)
    if (!existingHarvest) {
      throw new NotFoundException(`Harvest with ID "${id}" not found`)
    }
    return this.harvestsRepository.update(id, updateHarvestDto)
  }

  async remove(id: string): Promise<void> {
    const existingHarvest = await this.harvestsRepository.findById(id)
    if (!existingHarvest) {
      throw new NotFoundException(`Harvest with ID "${id}" not found`)
    }
    await this.harvestsRepository.remove(id)
  }
}
