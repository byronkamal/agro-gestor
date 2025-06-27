import { Test, TestingModule } from '@nestjs/testing'
import { ProducersService } from './producers.service'
import { IProducersRepository } from '../repositories/producers.repository'
import { NotFoundException, ConflictException } from '@nestjs/common'

describe('ProducersService', () => {
  let service: ProducersService
  let repository: jest.Mocked<IProducersRepository>

  const mockProducersRepository: jest.Mocked<IProducersRepository> = {
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
        ProducersService,
        {
          provide: IProducersRepository,
          useValue: mockProducersRepository,
        },
      ],
    }).compile()

    service = module.get<ProducersService>(ProducersService)
    repository = module.get<IProducersRepository>(
      IProducersRepository,
    ) as jest.Mocked<IProducersRepository>

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a producer', async () => {
      const createProducerDto = {
        document: '12345678900',
        name: 'Test Producer',
        document_type: 'CPF',
      }
      repository.findByDocument.mockResolvedValue(null)
      repository.create.mockResolvedValue({
        id: '1',
        ...createProducerDto,
      })

      const result = await service.create(createProducerDto)
      expect(result).toEqual({ id: '1', ...createProducerDto })
      expect(repository.findByDocument).toHaveBeenCalledWith(
        createProducerDto.document,
      )
      expect(repository.create).toHaveBeenCalledWith(createProducerDto)
    })

    it('should throw ConflictException if producer with document already exists', async () => {
      const createProducerDto = {
        document: '12345678900',
        name: 'Test Producer',
        document_type: 'CPF',
      }
      repository.findByDocument.mockResolvedValue({
        id: '1',
        ...createProducerDto,
      })

      await expect(service.create(createProducerDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findByDocument).toHaveBeenCalledWith(
        createProducerDto.document,
      )
      expect(repository.create).not.toHaveBeenCalled()
    })
  })

  describe('findAll', () => {
    it('should return an array of producers', async () => {
      const producers = [
        { id: '1', document: '123', name: 'P1', document_type: 'CPF' },
      ]
      repository.findAll.mockResolvedValue(producers)

      const result = await service.findAll()
      expect(result).toEqual(producers)
      expect(repository.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a producer by ID', async () => {
      const producer = {
        id: '1',
        document: '123',
        name: 'P1',
        document_type: 'CPF',
      }
      repository.findById.mockResolvedValue(producer)

      const result = await service.findOne('1')
      expect(result).toEqual(producer)
      expect(repository.findById).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if producer not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })

  describe('update', () => {
    it('should update a producer', async () => {
      const existingProducer = {
        id: '1',
        document: '123',
        name: 'P1',
        document_type: 'CPF',
      }
      const updateProducerDto = { name: 'Updated Producer' }
      repository.findById.mockResolvedValue(existingProducer)
      repository.findByDocument.mockResolvedValue(null)
      repository.update.mockResolvedValue({
        ...existingProducer,
        ...updateProducerDto,
      })

      const result = await service.update('1', updateProducerDto)
      expect(result).toEqual({ ...existingProducer, ...updateProducerDto })
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.update).toHaveBeenCalledWith('1', updateProducerDto)
    })

    it('should throw NotFoundException if producer not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(
        service.update('nonexistent', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException)
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.update).not.toHaveBeenCalled()
    })

    it('should throw ConflictException if document already exists for another producer', async () => {
      const existingProducer = {
        id: '1',
        document: '123',
        name: 'P1',
        document_type: 'CPF',
      }
      const producerWithSameDocument = {
        id: '2',
        document: 'newdoc',
        name: 'P2',
        document_type: 'CPF',
      }
      const updateProducerDto = { document: 'newdoc' }

      repository.findById.mockResolvedValue(existingProducer)
      repository.findByDocument.mockResolvedValue(producerWithSameDocument)

      await expect(service.update('1', updateProducerDto)).rejects.toThrow(
        ConflictException,
      )
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.findByDocument).toHaveBeenCalledWith(
        updateProducerDto.document,
      )
      expect(repository.update).not.toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove a producer', async () => {
      const existingProducer = {
        id: '1',
        document: '123',
        name: 'P1',
        document_type: 'CPF',
      }
      repository.findById.mockResolvedValue(existingProducer)
      repository.remove.mockResolvedValue(undefined)

      await service.remove('1')
      expect(repository.findById).toHaveBeenCalledWith('1')
      expect(repository.remove).toHaveBeenCalledWith('1')
    })

    it('should throw NotFoundException if producer not found', async () => {
      repository.findById.mockResolvedValue(null)

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      )
      expect(repository.findById).toHaveBeenCalledWith('nonexistent')
      expect(repository.remove).not.toHaveBeenCalled()
    })
  })
})
