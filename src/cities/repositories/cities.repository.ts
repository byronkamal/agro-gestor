import { City } from '../entities/city.entity'
import { CreateCityDto } from '../dtos/create-city.dto'
import { UpdateCityDto } from '../dtos/update-city.dto'

export abstract class ICitiesRepository {
  abstract create(data: CreateCityDto): Promise<City>
  abstract findAll(): Promise<City[]>
  abstract findById(id: string): Promise<City | null>
  abstract findByNameAndState(
    name: string,
    state_id: string,
  ): Promise<City | null>

  abstract update(id: string, data: UpdateCityDto): Promise<City>
  abstract remove(id: string): Promise<void>
}
