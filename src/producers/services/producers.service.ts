import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { IProducersRepository } from '../repositories/producers.repository'
import { CreateProducerDto } from '../dtos/create-producer.dto'
import { UpdateProducerDto } from '../dtos/update-producer.dto'
import { Producer } from '../entities/producer.entity'

@Injectable()
export class ProducersService {
  constructor(private readonly producersRepository: IProducersRepository) {}

  async create(createProducerDto: CreateProducerDto): Promise<Producer> {
    const existingProducer = await this.producersRepository.findByDocument(
      createProducerDto.document,
    )
    if (existingProducer) {
      throw new ConflictException('Producer with this document already exists')
    }
    return this.producersRepository.create(createProducerDto)
  }

  async findAll(): Promise<Producer[]> {
    return this.producersRepository.findAll()
  }

  async findOne(id: string): Promise<Producer> {
    const producer = await this.producersRepository.findById(id)
    if (!producer) {
      throw new NotFoundException(`Producer with ID "${id}" not found`)
    }
    return producer
  }

  async update(
    id: string,
    updateProducerDto: UpdateProducerDto,
  ): Promise<Producer> {
    const existingProducer = await this.producersRepository.findById(id)
    if (!existingProducer) {
      throw new NotFoundException(`Producer with ID "${id}" not found`)
    }
    if (
      updateProducerDto.document &&
      updateProducerDto.document !== existingProducer.document
    ) {
      const producerWithSameDocument =
        await this.producersRepository.findByDocument(
          updateProducerDto.document,
        )
      if (producerWithSameDocument && producerWithSameDocument.id !== id) {
        throw new ConflictException(
          'Another producer with this document already exists',
        )
      }
    }
    return this.producersRepository.update(id, updateProducerDto)
  }

  async remove(id: string): Promise<void> {
    const existingProducer = await this.producersRepository.findById(id)
    if (!existingProducer) {
      throw new NotFoundException(`Producer with ID "${id}" not found`)
    }
    await this.producersRepository.remove(id)
  }
}
