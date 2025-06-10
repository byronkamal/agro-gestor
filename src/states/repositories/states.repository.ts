import { State } from '../entities/state.entity'
import { CreateStateDto } from '../dtos/create-state.dto'
import { UpdateStateDto } from '../dtos/update-state.dto'

export abstract class IStatesRepository {
  abstract create(data: CreateStateDto): Promise<State>
  abstract findAll(): Promise<State[]>
  abstract findById(id: string): Promise<State | null>
  abstract findByName(name: string): Promise<State | null>
  abstract findByAcronym(acronym: string): Promise<State | null>
  abstract update(id: string, data: UpdateStateDto): Promise<State>
  abstract remove(id: string): Promise<void>
}
