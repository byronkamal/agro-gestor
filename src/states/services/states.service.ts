import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { IStatesRepository } from '../repositories/states.repository'
import { CreateStateDto } from '../dtos/create-state.dto'
import { UpdateStateDto } from '../dtos/update-state.dto'
import { State } from '../entities/state.entity'

@Injectable()
export class StatesService {
  constructor(private readonly statesRepository: IStatesRepository) {}

  async create(createStateDto: CreateStateDto): Promise<State> {
    const existingStateByName = await this.statesRepository.findByName(
      createStateDto.name,
    )
    if (existingStateByName) {
      throw new ConflictException(
        `State with name "${createStateDto.name}" already exists`,
      )
    }
    const existingStateByAcronym = await this.statesRepository.findByAcronym(
      createStateDto.acronym,
    )
    if (existingStateByAcronym) {
      throw new ConflictException(
        `State with acronym "${createStateDto.acronym}" already exists`,
      )
    }
    return this.statesRepository.create(createStateDto)
  }

  async findAll(): Promise<State[]> {
    return this.statesRepository.findAll()
  }

  async findOne(id: string): Promise<State> {
    const state = await this.statesRepository.findById(id)
    if (!state) {
      throw new NotFoundException(`State with ID "${id}" not found`)
    }
    return state
  }

  async update(id: string, updateStateDto: UpdateStateDto): Promise<State> {
    const existingState = await this.statesRepository.findById(id)
    if (!existingState) {
      throw new NotFoundException(`State with ID "${id}" not found`)
    }

    if (updateStateDto.name && updateStateDto.name !== existingState.name) {
      const stateWithSameName = await this.statesRepository.findByName(
        updateStateDto.name,
      )
      if (stateWithSameName && stateWithSameName.id !== id) {
        throw new ConflictException(
          `Another state with name "${updateStateDto.name}" already exists`,
        )
      }
    }

    if (
      updateStateDto.acronym &&
      updateStateDto.acronym !== existingState.acronym
    ) {
      const stateWithSameAcronym = await this.statesRepository.findByAcronym(
        updateStateDto.acronym,
      )
      if (stateWithSameAcronym && stateWithSameAcronym.id !== id) {
        throw new ConflictException(
          `Another state with acronym "${updateStateDto.acronym}" already exists`,
        )
      }
    }

    return this.statesRepository.update(id, updateStateDto)
  }

  async remove(id: string): Promise<void> {
    const existingState = await this.statesRepository.findById(id)
    if (!existingState) {
      throw new NotFoundException(`State with ID "${id}" not found`)
    }
    await this.statesRepository.remove(id)
  }
}
