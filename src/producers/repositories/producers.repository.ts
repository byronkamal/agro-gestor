import { Producer } from '../entities/producer.entity'
import { CreateProducerDto } from '../dtos/create-producer.dto'
import { UpdateProducerDto } from '../dtos/update-producer.dto'

export abstract class IProducersRepository {
  abstract create(data: CreateProducerDto): Promise<Producer>
  abstract findAll(): Promise<Producer[]>
  abstract findById(id: string): Promise<Producer | null>
  abstract findByDocument(document: string): Promise<Producer | null>
  abstract update(id: string, data: UpdateProducerDto): Promise<Producer>
  abstract remove(id: string): Promise<void>
}
