import { Test, TestingModule } from '@nestjs/testing'
import { CitiesService } from './cities.service'
import { ICitiesRepository } from '../repositories/cities.repository'
import { IStatesRepository } from '../../states/repositories/states.repository'
import { NotFoundException, ConflictException } from '@nestjs/common'

describe('CitiesService', () => {
  let service: CitiesService
  let citiesRepository: ICitiesRepository
  let statesRepository: IStatesRepository

  let mockCitiesRepository: {
    create: jest.Mock
    findAll: jest.Mock
    findById: jest.Mock
    findByNameAndState: jest.Mock
    update: jest.Mock
    remove: jest.Mock
  }

  let mockStatesRepository: {
    findById: jest.Mock
  }

  beforeEach(async () => {
    mockCitiesRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByNameAndState: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }

    mockStatesRepository = {
      findById: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: ICitiesRepository,
          useValue: mockCitiesRepository,
        },
        {
          provide: IStatesRepository,
          useValue: mockStatesRepository,
        },
      ],
    }).compile()

    service = module.get<CitiesService>(CitiesService)
    citiesRepository = module.get<ICitiesRepository>(ICitiesRepository)
    statesRepository = module.get<IStatesRepository>(IStatesRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a city', async () => {
      const createCityDto = { name: 'São Paulo', state_id: 'state1' }
      mockCitiesRepository.findByNameAndState.mockResolvedValue(null)
      mockStatesRepository.findById.mockResolvedValue({
        id: 'state1',
        name: 'São Paulo',
        acronym: 'SP',
      })
      mockCitiesRepository.create.mockResolvedValue({
        id: '1',
        ...createCityDto,
      })

      const result = await service.create(createCityDto)
      expect(result).toEqual({ id: '1', ...createCityDto })
      expect(citiesRepository.findByNameAndState).toHaveBeenCalledWith(
        createCityDto.name,
        createCityDto.state_id,
      )
      expect(statesRepository.findById).toHaveBeenCalledWith(
        createCityDto.state_id,
      )
      expect(citiesRepository.create).toHaveBeenCalledWith(createCityDto)
    })

    it('should throw ConflictException if city with name and state already exists', async () => {
      const createCityDto = { name: 'São Paulo', state_id: 'state1' }
      mockCitiesRepository.findByNameAndState.mockResolvedValue({
        id: '1',
        ...createCityDto,
      })

      await expect(service.create(createCityDto)).rejects.toThrow(
        ConflictException,
      )
      expect(citiesRepository.findByNameAndState).toHaveBeenCalledWith(
        createCityDto.name,
        createCityDto.state_id,
      )
      expect(statesRepository.findById).not.toHaveBeenCalled()
      expect(citiesRepository.create).not.toHaveBeenCalled()
    })

    it('should throw NotFoundException if state does not exist', async () => {
      const createCityDto = {
        name: 'São Paulo',
        state_id: 'nonexistent-state',
      }
      mockCitiesRepository.findByNameAndState.mockResolvedValue(null)
      mockStatesRepository.findById.mockResolvedValue(null)

      await expect(service.create(createCityDto)).rejects.toThrow(
        NotFoundException,
      )
      expect(citiesRepository.findByNameAndState).toHaveBeenCalledWith(
        createCityDto.name,
        createCityDto.state_id,
      )
      expect(statesRepository.findById).toHaveBeenCalledWith(
        createCityDto.state_id,
      )
      expect(citiesRepository.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return an array of cities', async () => {
      const cities = [{ id: '1', name: 'São Paulo', state_id: 'state1' }]
      mockCitiesRepository.findAll.mockResolvedValue(cities)

      const result = await service.findAll()
      expect(result).toEqual(cities)
      expect(citiesRepository.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a city by ID', async () => {
      const city = { id: '1', name: 'São Paulo', state_id: 'state1' }
      mockCitiesRepository.findById.mockResolvedValue(city)

      const result = await service.findOne('1')
      expect(result).toEqual(city)
      expect(citiesRepository.findById).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if city not found', async () => {
      mockCitiesRepository.findById.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(citiesRepository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('update', () => {
    it('should update a city', async () => {
      const existingCity = { id: '1', name: 'São Paulo', state_id: 'state1' }
      const updateCityDto = { name: 'São Paulo Updated' }
      mockCitiesRepository.findById.mockResolvedValue(existingCity)
      mockCitiesRepository.findByNameAndState.mockResolvedValue(null)
      mockCitiesRepository.update.mockResolvedValue({
        ...existingCity,
        ...updateCityDto,
      })

      const result = await service.update('1', updateCityDto)
      expect(result).toEqual({ ...existingCity, ...updateCityDto })
      expect(citiesRepository.findById).toHaveBeenCalledWith('1')
      expect(citiesRepository.update).toHaveBeenCalledWith('1', updateCityDto)
    })

    it('should throw NotFoundException if city not found', async () => {
      mockCitiesRepository.findById.mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException)
      expect(citiesRepository.findById).toHaveBeenCalledWith('nonexistent')
      expect(citiesRepository.update).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if name and state already exist for another city', async () => {
      const existingCity = { id: '1', name: 'São Paulo', state_id: 'state1' }
      const conflictingCity = {
        id: '2',
        name: 'New City Name',
        state_id: 'state2',
      }
      const updateCityDto = { name: 'New City Name', state_id: 'state2' }

      mockCitiesRepository.findById.mockResolvedValue(existingCity)
      mockCitiesRepository.findByNameAndState.mockResolvedValue(conflictingCity)

      await expect(service.update('1', updateCityDto)).rejects.toThrow(
        ConflictException,
      )
      expect(citiesRepository.findById).toHaveBeenCalledWith('1')
      expect(citiesRepository.findByNameAndState).toHaveBeenCalledWith(
        updateCityDto.name,
        updateCityDto.state_id,
      )
      expect(citiesRepository.update).not.toHaveBeenCalled()
    })

    it('should throw NotFoundException if updated state does not exist', async () => {
      const existingCity = { id: '1', name: 'São Paulo', state_id: 'state1' }
      const updateCityDto = { state_id: 'nonexistent-state' }

      mockCitiesRepository.findById.mockResolvedValue(existingCity)
      mockCitiesRepository.findByNameAndState.mockResolvedValue(null)
      mockStatesRepository.findById.mockResolvedValue(null)

      await expect(service.update('1', updateCityDto)).rejects.toThrow(
        NotFoundException,
      )
      expect(citiesRepository.findById).toHaveBeenCalledWith('1')
      expect(statesRepository.findById).toHaveBeenCalledWith(
        updateCityDto.state_id,
      )
      expect(citiesRepository.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a city', async () => {
      const existingCity = { id: '1', name: 'São Paulo', state_id: 'state1' }
      mockCitiesRepository.findById.mockResolvedValue(existingCity)
      mockCitiesRepository.remove.mockResolvedValue(undefined)

      await service.remove('1')
      expect(citiesRepository.findById).toHaveBeenCalledWith('1')
      expect(citiesRepository.remove).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if city not found', async () => {
      mockCitiesRepository.findById.mockResolvedValue(null)

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(citiesRepository.findById).toHaveBeenCalledWith('nonexistent')
      expect(citiesRepository.remove).not.toHaveBeenCalled()
    })
  })
})
