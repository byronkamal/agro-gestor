import { Test, TestingModule } from '@nestjs/testing'
import { HarvestsService } from './harvests.service'
import { IHarvestsRepository } from '../repositories/harvests.repository'
import { NotFoundException } from '@nestjs/common'

describe('HarvestsService', () => {
  let service: HarvestsService
  let repository: IHarvestsRepository

  let mockHarvestsRepository: {
    create: jest.Mock
    findAll: jest.Mock
    findById: jest.Mock
    update: jest.Mock
    remove: jest.Mock
  }

  beforeEach(async () => {
    mockHarvestsRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        {
          provide: IHarvestsRepository,
          useValue: mockHarvestsRepository,
        },
      ],
    }).compile()

    service = module.get<HarvestsService>(HarvestsService)
    repository = module.get<IHarvestsRepository>(IHarvestsRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a harvest', async () => {
      const createHarvestDto = { name: 'Safra 2024', year: 2024 }
      mockHarvestsRepository.create.mockResolvedValue({
        id: '1',
        ...createHarvestDto,
      })

      const result = await service.create(createHarvestDto)
      expect(result).toEqual({ id: '1', ...createHarvestDto })
      expect(repository.create).toHaveBeenCalledWith(createHarvestDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of harvests', async () => {
      const harvests = [{ id: '1', name: 'Safra 2023', year: 2023 }]
      mockHarvestsRepository.findAll.mockResolvedValue(harvests)

      const result = await service.findAll()
      expect(result).toEqual(harvests)
      expect(repository.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a harvest by ID', async () => {
      const harvest = { id: '1', name: 'Safra 2024', year: 2024 }
      mockHarvestsRepository.findById.mockResolvedValue(harvest)

      const result = await service.findOne('1')
      expect(result).toEqual(harvest)
      expect(repository.findById).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if harvest not found', async () => {
      mockHarvestsRepository.findById.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('update', () => {
    it('should update a harvest', async () => {
      const existingHarvest = { id: '1', name: 'Safra 2024', year: 2024 }
      const updateHarvestDto = { name: 'Safra 2025' }
      mockHarvestsRepository.findById.mockResolvedValue(existingHarvest)
      mockHarvestsRepository.update.mockResolvedValue({
        ...existingHarvest,
        ...updateHarvestDto,
      })

      const result = await service.update('1', updateHarvestDto)
      expect(result).toEqual({ ...existingHarvest, ...updateHarvestDto })
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.update).toHaveBeenCalledWith('1', updateHarvestDto)
    })

    it('should throw NotFoundException if harvest not found', async () => {
      mockHarvestsRepository.findById.mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException)
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a harvest', async () => {
      const existingHarvest = { id: '1', name: 'Safra 2024', year: 2024 }
      mockHarvestsRepository.findById.mockResolvedValue(existingHarvest)
      mockHarvestsRepository.remove.mockResolvedValue(undefined)

      await service.remove('1')
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.remove).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if harvest not found', async () => {
      mockHarvestsRepository.findById.mockResolvedValue(null)

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.remove).not.toHaveBeenCalled()
    })
  })
})
