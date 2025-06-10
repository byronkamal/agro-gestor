import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { ICropsRepository } from './crops.repository'
import { CreateCropDto } from '../dtos/create-crop.dto'
import { UpdateCropDto } from '../dtos/update-crop.dto'
import { Crop } from '../entities/crop.entity'

@Injectable()
export class CropsRepository implements ICropsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCropDto): Promise<Crop> {
    return this.prisma.crop.create({ data })
  }

  async findAll(): Promise<Crop[]> {
    return this.prisma.crop.findMany()
  }

  async findById(id: string): Promise<Crop | null> {
    return this.prisma.crop.findUnique({ where: { id } })
  }

  async findByName(name: string): Promise<Crop | null> {
    return this.prisma.crop.findUnique({ where: { name } })
  }

  async update(id: string, data: UpdateCropDto): Promise<Crop> {
    return this.prisma.crop.update({ where: { id }, data })
  }

  async remove(id: string): Promise<void> {
    await this.prisma.crop.delete({ where: { id } })
  }
}
