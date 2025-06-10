import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IProducersRepository } from './producers.repository'
import { CreateProducerDto } from '../dtos/create-producer.dto'
import { UpdateProducerDto } from '../dtos/update-producer.dto'
import { Producer } from '@prisma/client'

@Injectable()
export class ProducersRepository implements IProducersRepository {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProducerDto): Promise<Producer> {
    return this.prisma.producer.create({ data })
  }

  async findAll(): Promise<Producer[]> {
    return this.prisma.producer.findMany()
  }

  async findById(id: string): Promise<Producer | null> {
    return this.prisma.producer.findUnique({ where: { id } })
  }

  async findByDocument(document: string): Promise<Producer | null> {
    return this.prisma.producer.findUnique({ where: { document } })
  }

  async update(id: string, data: UpdateProducerDto): Promise<Producer> {
    return this.prisma.producer.update({ where: { id }, data })
  }

  async remove(id: string): Promise<void> {
    await this.prisma.producer.delete({ where: { id } })
  }
}
