import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

describe('PlatationsController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let farmId: string
  let cropId: string
  let harvestId: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    await app.init()
    prisma = moduleFixture.get<PrismaService>(PrismaService)

    // Create dependencies for Platation
    const producer = await prisma.producer.create({
      data: {
        document: '99999999999',
        name: 'Producer for Platation',
        document_type: 'CPF',
      },
    })
    const farm = await prisma.farm.create({
      data: {
        total_area: 100,
        farm_name: 'Farm for Platation',
        vegetation_area: 10,
        agricultural_area: 20,
        city_id: 'city_platation',
        producer_id: producer.id,
      },
    })
    const crop = await prisma.crop.create({
      data: { name: 'Crop for Platation' },
    })
    const harvest = await prisma.harvest.create({
      data: { name: 'Harvest for Platation', year: 2024 },
    })

    farmId = farm.id
    cropId = crop.id
    harvestId = harvest.id
  })

  beforeEach(async () => {
    await prisma.platation.deleteMany()
  })

  afterAll(async () => {
    await prisma.platation.deleteMany()
    await prisma.farm.deleteMany()
    await prisma.crop.deleteMany()
    await prisma.harvest.deleteMany()
    await prisma.producer.deleteMany()
    await app.close()
  })

  it('/platations (POST) should create a platation', async () => {
    const createPlatationDto = {
      farm_id: farmId,
      crop_id: cropId,
      harvest_id: harvestId,
    }
    const response = await request(app.getHttpServer())
      .post('/platations')
      .send(createPlatationDto)
      .expect(201)

    expect(response.body).toMatchObject(createPlatationDto)
    expect(response.body).toHaveProperty('id')
  })

  it('/platations (POST) should return 409 if platation with unique keys already exists', async () => {
    const createPlatationDto = {
      farm_id: farmId,
      crop_id: cropId,
      harvest_id: harvestId,
    }
    await request(app.getHttpServer())
      .post('/platations')
      .send(createPlatationDto)
      .expect(201)

    await request(app.getHttpServer())
      .post('/platations')
      .send(createPlatationDto)
      .expect(409)
  })

  it('/platations (GET) should return an array of platations', async () => {
    const platation1 = {
      farm_id: farmId,
      crop_id: cropId,
      harvest_id: harvestId,
    }
    await request(app.getHttpServer()).post('/platations').send(platation1)

    const response = await request(app.getHttpServer())
      .get('/platations')
      .expect(200)

    expect(response.body).toHaveLength(1)
    expect(response.body[0]).toMatchObject(platation1)
  })

  it('/platations/:id (GET) should return a platation by ID', async () => {
    const createPlatationDto = {
      farm_id: farmId,
      crop_id: cropId,
      harvest_id: harvestId,
    }
    const createdPlatation = await request(app.getHttpServer())
      .post('/platations')
      .send(createPlatationDto)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/platations/${createdPlatation.body.id}`)
      .expect(200)

    expect(response.body).toMatchObject(createPlatationDto)
    expect(response.body).toHaveProperty('id', createdPlatation.body.id)
  })

  it('/platations/:id (GET) should return 404 if platation not found', async () => {
    await request(app.getHttpServer())
      .get('/platations/nonexistent-id')
      .expect(404)
  })

  it('/platations/:id (PATCH) should update a platation', async () => {
    const createPlatationDto = {
      farm_id: farmId,
      crop_id: cropId,
      harvest_id: harvestId,
    }
    const createdPlatation = await request(app.getHttpServer())
      .post('/platations')
      .send(createPlatationDto)
      .expect(201)

    const newCrop = await prisma.crop.create({
      data: { name: 'New Crop for Platation' },
    })
    const updatePlatationDto = { crop_id: newCrop.id }
    const response = await request(app.getHttpServer())
      .patch(`/platations/${createdPlatation.body.id}`)
      .send(updatePlatationDto)
      .expect(200)

    expect(response.body).toMatchObject({
      ...createPlatationDto,
      ...updatePlatationDto,
    })
    expect(response.body).toHaveProperty('id', createdPlatation.body.id)
  })

  it('/platations/:id (PATCH) should return 404 if platation not found', async () => {
    await request(app.getHttpServer())
      .patch('/platations/nonexistent-id')
      .send({ crop_id: 'some-id' })
      .expect(404)
  })

  it('/platations/:id (PATCH) should return 409 if unique keys already exist for another platation', async () => {
    const createPlatationDto1 = {
      farm_id: farmId,
      crop_id: cropId,
      harvest_id: harvestId,
    }
    const createdPlatation1 = await request(app.getHttpServer())
      .post('/platations')
      .send(createPlatationDto1)
      .expect(201)

    const newHarvest = await prisma.harvest.create({
      data: { name: 'Another Harvest', year: 2025 },
    })
    const createPlatationDto2 = {
      farm_id: farmId,
      crop_id: cropId,
      harvest_id: newHarvest.id,
    }
    await request(app.getHttpServer())
      .post('/platations')
      .send(createPlatationDto2)
      .expect(201)

    const updatePlatationDto = { harvest_id: newHarvest.id }
    await request(app.getHttpServer())
      .patch(`/platations/${createdPlatation1.body.id}`)
      .send(updatePlatationDto)
      .expect(409)
  })

  it('/platations/:id (DELETE) should delete a platation', async () => {
    const createPlatationDto = {
      farm_id: farmId,
      crop_id: cropId,
      harvest_id: harvestId,
    }
    const createdPlatation = await request(app.getHttpServer())
      .post('/platations')
      .send(createPlatationDto)
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/platations/${createdPlatation.body.id}`)
      .expect(204)

    await request(app.getHttpServer())
      .get(`/platations/${createdPlatation.body.id}`)
      .expect(404)
  })

  it('/platations/:id (DELETE) should return 404 if platation not found', async () => {
    await request(app.getHttpServer())
      .delete('/platations/nonexistent-id')
      .expect(404)
  })
})
