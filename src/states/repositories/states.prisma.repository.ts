import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { IStatesRepository } from './states.repository'
import { CreateStateDto } from '../dtos/create-state.dto'
import { UpdateStateDto } from '../dtos/update-state.dto'
import { State } from '../entities/state.entity'

@Injectable()
export class StatesRepository implements IStatesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStateDto): Promise<State> {
    return this.prisma.state.create({ data })
  }

  async findAll(): Promise<State[]> {
    return this.prisma.state.findMany()
  }

  async findById(id: string): Promise<State | null> {
    return this.prisma.state.findUnique({ where: { id } })
  }

  async findByName(name: string): Promise<State | null> {
    return this.prisma.state.findUnique({ where: { name } })
  }

  async findByAcronym(acronym: string): Promise<State | null> {
    return this.prisma.state.findUnique({ where: { acronym } })
  }

  async update(id: string, data: UpdateStateDto): Promise<State> {
    return this.prisma.state.update({ where: { id }, data })
  }

  async remove(id: string): Promise<void> {
    await this.prisma.state.delete({ where: { id } })
  }
}
