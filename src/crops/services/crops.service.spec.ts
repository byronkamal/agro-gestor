import { Test, TestingModule } from '@nestjs/testing'
import { CropsService } from './crops.service'
import { ICropsRepository } from '../repositories/crops.repository'
import { NotFoundException, ConflictException } from '@nestjs/common'

describe('CropsService', () => {
  let service: CropsService
  let repository: jest.Mocked<ICropsRepository>

  const mockCropsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropsService,
        {
          provide: ICropsRepository,
          useValue: mockCropsRepository,
        },
      ],
    }).compile()

    service = module.get<CropsService>(CropsService)
    repository = module.get(ICropsRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', function (this: void) {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a crop', async function (this: void) {
      const createCropDto = { name: 'Test Crop' }

      repository.findByName.mockResolvedValue(null)
      repository.create.mockResolvedValue({ id: '1', ...createCropDto })

      const result = await service.create(createCropDto)

      expect(result).toEqual({ id: '1', ...createCropDto })
      expect(repository.findByName).toHaveBeenCalledWith(createCropDto.name)
      expect(repository.create).toHaveBeenCalledWith(createCropDto)
    })

    it('should throw ConflictException if crop with name already exists', async function (this: void) {
      const createCropDto = { name: 'Test Crop' }

      repository.findByName.mockResolvedValue({ id: '1', ...createCropDto })

      await expect(service.create(createCropDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findByName).toHaveBeenCalledWith(createCropDto.name)
      expect(repository.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return an array of crops', async function (this: void) {
      const crops = [{ id: '1', name: 'C1' }]

      repository.findAll.mockResolvedValue(crops)

      const result = await service.findAll()
      expect(result).toEqual(crops)
      expect(repository.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a crop by ID', async function (this: void) {
      const crop = { id: '1', name: 'C1' }

      repository.findById.mockResolvedValue(crop)

      const result = await service.findOne('1')
      expect(result).toEqual(crop)
      expect(repository.findById).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if crop not found', async function (this: void) {
      repository.findById.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('update', () => {
    it('should update a crop', async function (this: void) {
      const existingCrop = { id: '1', name: 'C1' }
      const updateCropDto = { name: 'Updated Crop' }

      repository.findById.mockResolvedValue(existingCrop)
      repository.findByName.mockResolvedValue(null)
      repository.update.mockResolvedValue({ ...existingCrop, ...updateCropDto })

      const result = await service.update('1', updateCropDto)

      expect(result).toEqual({ ...existingCrop, ...updateCropDto })
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.findByName).toHaveBeenCalledWith(updateCropDto.name)
      expect(repository.update).toHaveBeenCalledWith('1', updateCropDto)
    })

    it('should throw NotFoundException if crop not found', async function (this: void) {
      repository.findById.mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException)

      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.update).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if name already exists for another crop', async function (this: void) {
      const existingCrop = { id: '1', name: 'C1' }
      const updateCropDto = { name: 'newname' }
      const cropWithSameName = { id: '2', name: 'newname' }

      repository.findById.mockResolvedValue(existingCrop)
      repository.findByName.mockResolvedValue(cropWithSameName)

      await expect(service.update('1', updateCropDto)).rejects.toThrow(
        ConflictException,
      )

      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.findByName).toHaveBeenCalledWith(updateCropDto.name)
      expect(repository.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a crop', async function (this: void) {
      const existingCrop = { id: '1', name: 'C1' }

      repository.findById.mockResolvedValue(existingCrop)
      repository.remove.mockResolvedValue(undefined)

      await service.remove('1')

      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.remove).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if crop not found', async function (this: void) {
      repository.findById.mockResolvedValue(null)

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      )

      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.remove).not.toHaveBeenCalled()
    })
  })
})
