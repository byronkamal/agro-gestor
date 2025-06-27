import { Test, TestingModule } from '@nestjs/testing'
import { StatesService } from './states.service'
import { IStatesRepository } from '../repositories/states.repository'
import { NotFoundException, ConflictException } from '@nestjs/common'

describe('StatesService', () => {
  let service: StatesService
  let repository: jest.Mocked<IStatesRepository>

  const mockStatesRepository: jest.Mocked<IStatesRepository> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByAcronym: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatesService,
        {
          provide: IStatesRepository,
          useValue: mockStatesRepository,
        },
      ],
    }).compile()

    service = module.get<StatesService>(StatesService)
    repository = module.get(IStatesRepository)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a state', async () => {
      const createStateDto = { name: 'São Paulo', acronym: 'SP' }
      repository.findByName.mockResolvedValue(null)
      repository.findByAcronym.mockResolvedValue(null)
      repository.create.mockResolvedValue({ id: '1', ...createStateDto })

      const result = await service.create(createStateDto)

      expect(result).toEqual({ id: '1', ...createStateDto })
      expect(repository.findByName).toHaveBeenCalledWith(createStateDto.name)
      expect(repository.findByAcronym).toHaveBeenCalledWith(
        createStateDto.acronym,
      )
      expect(repository.create).toHaveBeenCalledWith(createStateDto)
    })

    it('should throw ConflictException if state with name already exists', async () => {
      const createStateDto = { name: 'São Paulo', acronym: 'SP' }
      repository.findByName.mockResolvedValue({ id: '1', ...createStateDto })

      await expect(service.create(createStateDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findByName).toHaveBeenCalledWith(createStateDto.name)
      expect(repository.findByAcronym).not.toHaveBeenCalled()
      expect(repository.create).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if state with acronym already exists', async () => {
      const createStateDto = { name: 'Rio de Janeiro', acronym: 'RJ' }
      repository.findByName.mockResolvedValue(null)
      repository.findByAcronym.mockResolvedValue({ id: '1', ...createStateDto })

      await expect(service.create(createStateDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findByName).toHaveBeenCalledWith(createStateDto.name)
      expect(repository.findByAcronym).toHaveBeenCalledWith(
        createStateDto.acronym,
      )
      expect(repository.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return an array of states', async () => {
      const states = [{ id: '1', name: 'São Paulo', acronym: 'SP' }]
      repository.findAll.mockResolvedValue(states)

      const result = await service.findAll()
      expect(result).toEqual(states)
      expect(repository.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a state by ID', async () => {
      const state = { id: '1', name: 'São Paulo', acronym: 'SP' }
      repository.findById.mockResolvedValue(state)

      const result = await service.findOne('1')
      expect(result).toEqual(state)
      expect(repository.findById).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if state not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('update', () => {
    it('should update a state', async () => {
      const existingState = { id: '1', name: 'São Paulo', acronym: 'SP' }
      const updateStateDto = { name: 'Sao Paulo Updated' }
      repository.findById.mockResolvedValue(existingState)
      repository.findByName.mockResolvedValue(null)
      repository.findByAcronym.mockResolvedValue(null)
      repository.update.mockResolvedValue({
        ...existingState,
        ...updateStateDto,
      })

      const result = await service.update('1', updateStateDto)
      expect(result).toEqual({ ...existingState, ...updateStateDto })
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.update).toHaveBeenCalledWith('1', updateStateDto)
    })

    it('should throw NotFoundException if state not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException)
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.update).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if name already exists for another state', async () => {
      const existingState = { id: '1', name: 'São Paulo', acronym: 'SP' }
      const stateWithSameName = {
        id: '2',
        name: 'New State Name',
        acronym: 'NS',
      }
      const updateStateDto = { name: 'New State Name' }

      repository.findById.mockResolvedValue(existingState)
      repository.findByName.mockResolvedValue(stateWithSameName)

      await expect(service.update('1', updateStateDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.findByName).toHaveBeenCalledWith(updateStateDto.name)
      expect(repository.update).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if acronym already exists for another state', async () => {
      const existingState = { id: '1', name: 'São Paulo', acronym: 'SP' }
      const stateWithSameAcronym = {
        id: '2',
        name: 'Another State',
        acronym: 'AS',
      }
      const updateStateDto = { acronym: 'AS' }

      repository.findById.mockResolvedValue(existingState)
      repository.findByName.mockResolvedValue(null)
      repository.findByAcronym.mockResolvedValue(stateWithSameAcronym)

      await expect(service.update('1', updateStateDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.findByAcronym).toHaveBeenCalledWith(
        updateStateDto.acronym,
      )
      expect(repository.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a state', async () => {
      const existingState = { id: '1', name: 'São Paulo', acronym: 'SP' }
      repository.findById.mockResolvedValue(existingState)
      repository.remove.mockResolvedValue(undefined)

      await service.remove('1')
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.remove).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if state not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.remove).not.toHaveBeenCalled()
    })
  })
})
