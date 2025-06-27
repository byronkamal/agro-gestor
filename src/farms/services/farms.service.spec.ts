import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import { FarmsService } from './farms.service'
import { IFarmsRepository } from '../repositories/farms.repository'
import { ICitiesRepository } from '../../cities/repositories/cities.repository'
import { IProducersRepository } from '../../producers/repositories/producers.repository'

describe('FarmsService', () => {
  let service: FarmsService
  let repository: IFarmsRepository

  const mockFarmsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  const mockCitiesRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByNameAndState: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  const mockProducersRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByDocument: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        {
          provide: IFarmsRepository,
          useValue: mockFarmsRepository,
        },
        {
          provide: ICitiesRepository,
          useValue: mockCitiesRepository,
        },
        {
          provide: IProducersRepository,
          useValue: mockProducersRepository,
        },
      ],
    }).compile()

    service = module.get<FarmsService>(FarmsService)
    repository = module.get<IFarmsRepository>(IFarmsRepository)

    jest.clearAllMocks()
  })

  it('should be defined', function (this: void) {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a farm', async () => {
      const createFarmDto = {
        total_area: 100,
        farm_name: 'Test Farm',
        vegetation_area: 20,
        agricultural_area: 30,
        city_id: 'city1',
        producer_id: 'producer1',
        validate: jest.fn(),
      }

      const city = { id: 'city1', name: 'City Test' }
      const producer = {
        id: 'producer1',
        name: 'Producer Test',
        document: '123.456.789-00',
        document_type: 'CPF',
      }

      mockProducersRepository.findById.mockResolvedValue(producer)
      mockCitiesRepository.findById.mockResolvedValue(city)
      mockFarmsRepository.create.mockResolvedValue({
        id: '1',
        ...createFarmDto,
      })

      const result = await service.create(createFarmDto)

      expect(result).toEqual({ id: '1', ...createFarmDto })
      expect(repository.create).toHaveBeenCalledWith(createFarmDto)
      expect(mockCitiesRepository.findById).toHaveBeenCalledWith('city1')
    })

    it('should throw BadRequestException if total area is less than sum of vegetation and agricultural areas', async function (this: void) {
      const createFarmDto = {
        total_area: 30,
        vegetation_area: 20,
        agricultural_area: 20,
        farm_name: 'Test Farm',
        city_id: 'city1',
        producer_id: 'producer1',
        validate: jest.fn(),
      }

      const city = { id: 'city1', name: 'City Test' }
      const producer = {
        id: 'producer1',
        name: 'Producer Test',
        document: '123.456.789-00',
        document_type: 'CPF',
      }

      mockProducersRepository.findById.mockResolvedValue(producer)
      mockCitiesRepository.findById.mockResolvedValue(city)

      await expect(service.create(createFarmDto)).rejects.toThrow(
        BadRequestException,
      )
      expect(repository.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return an array of farms', async function (this: void) {
      const farms = [
        {
          id: '1',
          total_area: 100,
          farm_name: 'F1',
          vegetation_area: 20,
          agricultural_area: 30,
          city_id: 'city1',
          producer_id: 'producer1',
        },
      ]
      mockFarmsRepository.findAll.mockResolvedValue(farms)

      const result = await service.findAll()
      expect(result).toEqual(farms)
      expect(repository.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a farm by ID', async function (this: void) {
      const farm = {
        id: '1',
        total_area: 100,
        farm_name: 'F1',
        vegetation_area: 20,
        agricultural_area: 30,
        city_id: 'city1',
        producer_id: 'producer1',
      }
      mockFarmsRepository.findById.mockResolvedValue(farm)

      const result = await service.findOne('1')
      expect(result).toEqual(farm)
      expect(repository.findById).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if farm not found', async function (this: void) {
      mockFarmsRepository.findById.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('update', () => {
    it('should update a farm', async function (this: void) {
      const existingFarm = {
        id: '1',
        total_area: 100,
        farm_name: 'F1',
        vegetation_area: 20,
        agricultural_area: 30,
        city_id: 'city1',
        producer_id: 'producer1',
      }
      const updateFarmDto = { farm_name: 'Updated Farm' }
      mockFarmsRepository.findById.mockResolvedValue(existingFarm)
      mockFarmsRepository.update.mockResolvedValue({
        ...existingFarm,
        ...updateFarmDto,
      })

      const result = await service.update('1', updateFarmDto)
      expect(result).toEqual({ ...existingFarm, ...updateFarmDto })
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.update).toHaveBeenCalledWith('1', updateFarmDto)
    })

    it('should throw NotFoundException if farm not found', async function (this: void) {
      mockFarmsRepository.findById.mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { farm_name: 'Updated' }),
      ).rejects.toThrow(NotFoundException)
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.update).not.toHaveBeenCalled()
    })

    it('should throw BadRequestException if updated areas exceed total area', async function (this: void) {
      const existingFarm = {
        id: '1',
        total_area: 100,
        farm_name: 'F1',
        vegetation_area: 20,
        agricultural_area: 30,
        city_id: 'city1',
        producer_id: 'producer1',
      }
      const updateFarmDto = { vegetation_area: 60, agricultural_area: 50 }

      mockFarmsRepository.findById.mockResolvedValue(existingFarm)

      await expect(service.update('1', updateFarmDto)).rejects.toThrow(
        BadRequestException,
      )
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a farm', async function (this: void) {
      const existingFarm = {
        id: '1',
        total_area: 100,
        farm_name: 'F1',
        vegetation_area: 20,
        agricultural_area: 30,
        city_id: 'city1',
        producer_id: 'producer1',
      }
      mockFarmsRepository.findById.mockResolvedValue(existingFarm)
      mockFarmsRepository.remove.mockResolvedValue(undefined)

      await service.remove('1')
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.remove).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if farm not found', async function (this: void) {
      mockFarmsRepository.findById.mockResolvedValue(null)

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.remove).not.toHaveBeenCalled()
    })
  })
})
