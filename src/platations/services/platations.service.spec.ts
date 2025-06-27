import { Test, TestingModule } from '@nestjs/testing'
import { PlatationsService } from './platations.service'
import { IPlatationsRepository } from '../repositories/platations.repository'
import { NotFoundException, ConflictException } from '@nestjs/common'

describe('PlatationsService', function () {
  let service: PlatationsService
  let repository: jest.Mocked<IPlatationsRepository>

  const mockRepository = (): jest.Mocked<IPlatationsRepository> => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByUniqueKeys: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatationsService,
        {
          provide: IPlatationsRepository,
          useValue: mockRepository(),
        },
      ],
    }).compile()

    service = module.get<PlatationsService>(PlatationsService)
    repository = module.get(IPlatationsRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a platation', async () => {
      const dto = {
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }

      repository.findByUniqueKeys.mockResolvedValue(null)
      repository.create.mockResolvedValue({ id: '1', ...dto })

      const result = await service.create(dto)

      expect(result).toEqual({ id: '1', ...dto })
      expect(repository.findByUniqueKeys).toHaveBeenCalledWith(
        dto.farm_id,
        dto.crop_id,
        dto.harvest_id,
      )
      expect(repository.create).toHaveBeenCalledWith(dto)
    })

    it('should throw ConflictException if platation already exists', async () => {
      const dto = {
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }

      repository.findByUniqueKeys.mockResolvedValue({ id: 'existing', ...dto })

      await expect(service.create(dto)).rejects.toThrow(ConflictException)
      expect(repository.findByUniqueKeys).toHaveBeenCalled()
      expect(repository.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return all platations', async () => {
      const data = [
        { id: '1', farm_id: 'farm1', crop_id: 'crop1', harvest_id: 'harvest1' },
      ]

      repository.findAll.mockResolvedValue(data)

      const result = await service.findAll()

      expect(result).toEqual(data)
      expect(repository.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return platation by ID', async () => {
      const data = {
        id: '1',
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }

      repository.findById.mockResolvedValue(data)

      const result = await service.findOne('1')

      expect(result).toEqual(data)
      expect(repository.findById).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if platation not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('update', () => {
    it('should update a platation', async () => {
      const existing = {
        id: '1',
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }
      const dto = { crop_id: 'crop2' }

      repository.findById.mockResolvedValue(existing)
      repository.findByUniqueKeys.mockResolvedValue(null)
      repository.update.mockResolvedValue({ ...existing, ...dto })

      const result = await service.update('1', dto)

      expect(result).toEqual({ ...existing, ...dto })
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.findByUniqueKeys).toHaveBeenCalledWith(
        existing.farm_id,
        dto.crop_id,
        existing.harvest_id,
      )
      expect(repository.update).toHaveBeenCalledWith('1', dto)
    })

    it('should throw NotFoundException if platation not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { crop_id: 'any' }),
      ).rejects.toThrow(NotFoundException)
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.update).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if unique constraint fails', async () => {
      const existing = {
        id: '1',
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }
      const dto = { crop_id: 'crop2' }
      const conflict = { id: '2', ...existing, crop_id: 'crop2' }

      repository.findById.mockResolvedValue(existing)
      repository.findByUniqueKeys.mockResolvedValue(conflict)

      await expect(service.update('1', dto)).rejects.toThrow(ConflictException)
      expect(repository.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a platation', async () => {
      const existing = {
        id: '1',
        farm_id: 'farm1',
        crop_id: 'crop1',
        harvest_id: 'harvest1',
      }

      repository.findById.mockResolvedValue(existing)
      repository.remove.mockResolvedValue(undefined)

      await service.remove('1')

      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.remove).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if platation not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.remove).not.toHaveBeenCalled()
    })
  })
})
