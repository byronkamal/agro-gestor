import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IFarmsRepository } from './farms.repository'
import { CreateFarmDto } from '../dtos/create-farm.dto'
import { UpdateFarmDto } from '../dtos/update-farm.dto'
import { Farm } from '../entities/farm.entity'

@Injectable()
export class FarmsRepository implements IFarmsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFarmDto): Promise<Farm> {
    return this.prisma.farm.create({ data })
  }

  async findAll(): Promise<Farm[]> {
    return this.prisma.farm.findMany({
      include: {
        producer: true,
        city: {
          include: {
            state: true,
          },
        },
      },
    })
  }

  async findById(id: string): Promise<Farm | null> {
    return this.prisma.farm.findUnique({ where: { id } })
  }

  async update(id: string, data: UpdateFarmDto): Promise<Farm> {
    return this.prisma.farm.update({ where: { id }, data })
  }

  async remove(id: string): Promise<void> {
    await this.prisma.farm.delete({ where: { id } })
  }
}
