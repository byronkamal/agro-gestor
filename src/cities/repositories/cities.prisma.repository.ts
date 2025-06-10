import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { ICitiesRepository } from './cities.repository'
import { CreateCityDto } from '../dtos/create-city.dto'
import { UpdateCityDto } from '../dtos/update-city.dto'
import { City } from '../entities/city.entity'

@Injectable()
export class CitiesRepository implements ICitiesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCityDto): Promise<City> {
    return this.prisma.city.create({ data })
  }

  async findAll(): Promise<City[]> {
    return this.prisma.city.findMany({
      include: {
        state: true,
      },
    })
  }

  async findById(id: string): Promise<City | null> {
    return this.prisma.city.findUnique({
      where: { id },
      include: {
        state: true,
      },
    })
  }

  async findByNameAndState(
    name: string,
    state_id: string,
  ): Promise<City | null> {
    return this.prisma.city.findUnique({
      where: {
        name_state_id: {
          name,
          state_id,
        },
      },
    })
  }

  async update(id: string, data: UpdateCityDto): Promise<City> {
    return this.prisma.city.update({ where: { id }, data })
  }

  async remove(id: string): Promise<void> {
    await this.prisma.city.delete({ where: { id } })
  }
}
