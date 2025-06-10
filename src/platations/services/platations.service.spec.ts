import { Test, TestingModule } from '@nestjs/testing'
import { PlatationsService } from './platations.service'
import { IPlatationsRepository } from '../repositories/platations.repository'
import { NotFoundException, ConflictException } from '@nestjs/common'

describe('PlatationsService', () => {
  let service: PlatationsService
  let repository: IPlatationsRepository

  const mockPlatationsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByUniqueKeys: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatationsService,
        {
          provide: IPlatationsRepository,
          useValue: mockPlatationsRepository,
        },
      ],
    }).compile()

    service = module.get<PlatationsService>(PlatationsService)
    repository = module.get<IPlatationsRepository>(IPlatationsRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a platation', async () => {
      const createPlatationDto = {
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }
      mockPlatationsRepository.findByUniqueKeys.mockResolvedValue(null)
      mockPlatationsRepository.create.mockResolvedValue({
        id: '1',
        ...createPlatationDto,
      })

      const result = await service.create(createPlatationDto)
      expect(result).toEqual({ id: '1', ...createPlatationDto })
      expect(repository.findByUniqueKeys).toHaveBeenCalledWith(
        createPlatationDto.farm_id,
        createPlatationDto.crop_id,
        createPlatationDto.harvest_id,
      )
      expect(repository.create).toHaveBeenCalledWith(createPlatationDto)
    })

    it('should throw ConflictException if platation with unique keys already exists', async () => {
      const createPlatationDto = {
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }
      mockPlatationsRepository.findByUniqueKeys.mockResolvedValue({
        id: '1',
        ...createPlatationDto,
      })

      await expect(service.create(createPlatationDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findByUniqueKeys).toHaveBeenCalledWith(
        createPlatationDto.farm_id,
        createPlatationDto.crop_id,
        createPlatationDto.harvest_id,
      )
      expect(repository.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return an array of platations', async () => {
      const platations = [
        { id: '1', farm_id: 'farm1', crop_id: 'crop1', harvest_id: 'harvest1' },
      ]
      mockPlatationsRepository.findAll.mockResolvedValue(platations)

      const result = await service.findAll()
      expect(result).toEqual(platations)
      expect(repository.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a platation by ID', async () => {
      const platation = {
        id: '1',
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }
      mockPlatationsRepository.findById.mockResolvedValue(platation)

      const result = await service.findOne('1')
      expect(result).toEqual(platation)
      expect(repository.findById).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if platation not found', async () => {
      mockPlatationsRepository.findById.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('update', () => {
    it('should update a platation', async () => {
      const existingPlatation = {
        id: '1',
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }
      const updatePlatationDto = { crop_id: 'crop2' }
      mockPlatationsRepository.findById.mockResolvedValue(existingPlatation)
      mockPlatationsRepository.findByUniqueKeys.mockResolvedValue(null) // No conflict
      mockPlatationsRepository.update.mockResolvedValue({
        ...existingPlatation,
        ...updatePlatationDto,
      })

      const result = await service.update('1', updatePlatationDto)
      expect(result).toEqual({ ...existingPlatation, ...updatePlatationDto })
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.update).toHaveBeenCalledWith('1', updatePlatationDto)
    })

    it('should throw NotFoundException if platation not found', async () => {
      mockPlatationsRepository.findById.mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { crop_id: 'crop2' }),
      ).rejects.toThrow(NotFoundException)
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.update).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if unique keys already exist for another platation', async () => {
      const existingPlatation = {
        id: '1',
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }
      const platationWithSameKeys = {
        id: '2',
        farm_id: 'farm1',
        crop_id: 'crop2',
        harvest_id: 'harvest1',
      }
      const updatePlatationDto = { crop_id: 'crop2' }

      mockPlatationsRepository.findById.mockResolvedValue(existingPlatation)
      mockPlatationsRepository.findByUniqueKeys.mockResolvedValue(
        platationWithSameKeys,
      )

      await expect(service.update('1', updatePlatationDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.findByUniqueKeys).toHaveBeenCalledWith(
        existingPlatation.farm_id,
        updatePlatationDto.crop_id,
        existingPlatation.harvest_id,
      )
      expect(repository.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a platation', async () => {
      const existingPlatation = {
        id: '1',
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }
      mockPlatationsRepository.findById.mockResolvedValue(existingPlatation)
      mockPlatationsRepository.remove.mockResolvedValue(undefined)

      await service.remove('1')
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.remove).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if platation not found', async () => {
      mockPlatationsRepository.findById.mockResolvedValue(null)

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.remove).not.toHaveBeenCalled()
    })
  })
})
