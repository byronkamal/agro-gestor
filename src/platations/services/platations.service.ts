import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { IPlatationsRepository } from '../repositories/platations.repository'
import { CreatePlatationDto } from '../dtos/create-platation.dto'
import { UpdatePlatationDto } from '../dtos/update-platation.dto'
import { Platation } from '../entities/platation.entity'

@Injectable()
export class PlatationsService {
  constructor(private readonly platationsRepository: IPlatationsRepository) {}

  async create(createPlatationDto: CreatePlatationDto): Promise<Platation> {
    const existingPlatation = await this.platationsRepository.findByUniqueKeys(
      createPlatationDto.farm_id,
      createPlatationDto.crop_id,
      createPlatationDto.harvest_id,
    )
    if (existingPlatation) {
      throw new ConflictException(
        'This platation already exists for this farm, crop, and harvest combination.',
      )
    }
    return this.platationsRepository.create(createPlatationDto)
  }

  async findAll(): Promise<Platation[]> {
    return this.platationsRepository.findAll()
  }

  async findOne(id: string): Promise<Platation> {
    const platation = await this.platationsRepository.findById(id)
    if (!platation) {
      throw new NotFoundException(`Platation with ID "${id}" not found`)
    }
    return platation
  }

  async update(
    id: string,
    updatePlatationDto: UpdatePlatationDto,
  ): Promise<Platation> {
    const existingPlatation = await this.platationsRepository.findById(id)
    if (!existingPlatation) {
      throw new NotFoundException(`Platation with ID "${id}" not found`)
    }

    // Check for unique key conflict if any of the unique key fields are being updated
    if (
      updatePlatationDto.farm_id ||
      updatePlatationDto.crop_id ||
      updatePlatationDto.harvest_id
    ) {
      const farmId = updatePlatationDto.farm_id ?? existingPlatation.farm_id
      const cropId = updatePlatationDto.crop_id ?? existingPlatation.crop_id
      const harvestId =
        updatePlatationDto.harvest_id ?? existingPlatation.harvest_id

      const platationWithSameKeys =
        await this.platationsRepository.findByUniqueKeys(
          farmId,
          cropId,
          harvestId,
        )
      if (platationWithSameKeys && platationWithSameKeys.id !== id) {
        throw new ConflictException(
          'Another platation with this farm, crop, and harvest combination already exists.',
        )
      }
    }

    return this.platationsRepository.update(id, updatePlatationDto)
  }

  async remove(id: string): Promise<void> {
    const existingPlatation = await this.platationsRepository.findById(id)
    if (!existingPlatation) {
      throw new NotFoundException(`Platation with ID "${id}" not found`)
    }
    await this.platationsRepository.remove(id)
  }
}
