import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { ICitiesRepository } from '../repositories/cities.repository'
import { CreateCityDto } from '../dtos/create-city.dto'
import { UpdateCityDto } from '../dtos/update-city.dto'
import { City } from '../entities/city.entity'
import { IStatesRepository } from '../../states/repositories/states.repository'

@Injectable()
export class CitiesService {
  constructor(
    private readonly citiesRepository: ICitiesRepository,
    private readonly statesRepository: IStatesRepository,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const existingCity = await this.citiesRepository.findByNameAndState(
      createCityDto.name,
      createCityDto.state_id,
    )
    if (existingCity) {
      throw new ConflictException(
        `City with name "${createCityDto.name}" in state "${createCityDto.state_id}" already exists`,
      )
    }
    const stateExists = await this.statesRepository.findById(
      createCityDto.state_id,
    )
    if (!stateExists) {
      throw new NotFoundException(
        `State with ID "${createCityDto.state_id}" not found`,
      )
    }
    return this.citiesRepository.create(createCityDto)
  }

  async findAll(): Promise<City[]> {
    return this.citiesRepository.findAll()
  }

  async findOne(id: string): Promise<City> {
    const city = await this.citiesRepository.findById(id)
    if (!city) {
      throw new NotFoundException(`City with ID "${id}" not found`)
    }
    return city
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    const existingCity = await this.citiesRepository.findById(id)
    if (!existingCity) {
      throw new NotFoundException(`City with ID "${id}" not found`)
    }

    if (updateCityDto.name || updateCityDto.state_id) {
      const newName = updateCityDto.name ?? existingCity.name
      const newStateId = updateCityDto.state_id ?? existingCity.state_id

      const cityWithSameKeys = await this.citiesRepository.findByNameAndState(
        newName,
        newStateId,
      )
      if (cityWithSameKeys && cityWithSameKeys.id !== id) {
        throw new ConflictException(
          `Another city with name "${newName}" in state "${newStateId}" already exists`,
        )
      }
    }

    if (updateCityDto.state_id) {
      const stateExists = await this.statesRepository.findById(
        updateCityDto.state_id,
      )
      if (!stateExists) {
        throw new NotFoundException(
          `State with ID "${updateCityDto.state_id}" not found`,
        )
      }
    }

    return this.citiesRepository.update(id, updateCityDto)
  }

  async remove(id: string): Promise<void> {
    const existingCity = await this.citiesRepository.findById(id)
    if (!existingCity) {
      throw new NotFoundException(`City with ID "${id}" not found`)
    }
    await this.citiesRepository.remove(id)
  }
}
