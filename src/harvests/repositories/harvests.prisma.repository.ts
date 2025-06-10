import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IHarvestsRepository } from './harvests.repository'
import { CreateHarvestDto } from '../dtos/create-harvest.dto'
import { UpdateHarvestDto } from '../dtos/update-harvest.dto'
import { Harvest } from '../entities/harvest.entity'

@Injectable()
export class HarvestsRepository implements IHarvestsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateHarvestDto): Promise<Harvest> {
    return this.prisma.harvest.create({ data })
  }

  async findAll(): Promise<Harvest[]> {
    return this.prisma.harvest.findMany()
  }

  async findById(id: string): Promise<Harvest | null> {
    return this.prisma.harvest.findUnique({ where: { id } })
  }

  async update(id: string, data: UpdateHarvestDto): Promise<Harvest> {
    return this.prisma.harvest.update({ where: { id }, data })
  }

  async remove(id: string): Promise<void> {
    await this.prisma.harvest.delete({ where: { id } })
  }
}
