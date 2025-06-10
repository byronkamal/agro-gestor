import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

describe('FarmsController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let producerId: string
  let cityId: string

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

    // Create a producer for foreign key constraint
    const producer = await prisma.producer.create({
      data: {
        document: '12345678900',
        name: 'Test Producer for Farm',
        document_type: 'CPF',
      },
    })
    producerId = producer.id

    // Create a state and city for foreign key constraint
    const state = await prisma.state.create({
      data: { name: 'Test State for Farm', acronym: 'TF' },
    })
    const city = await prisma.city.create({
      data: { name: 'Test City for Farm', state_id: state.id },
    })
    cityId = city.id
  })

  beforeEach(async () => {
    await prisma.farm.deleteMany()
  })

  afterAll(async () => {
    await prisma.farm.deleteMany()
    await prisma.city.deleteMany()
    await prisma.state.deleteMany()
    await prisma.producer.deleteMany()
    await app.close()
  })

  it('/farms (POST) should create a farm', async () => {
    const createFarmDto = {
      total_area: 100,
      farm_name: 'Test Farm',
      vegetation_area: 20,
      agricultural_area: 30,
      city_id: cityId,
      producer_id: producerId,
    }
    const response = await request(app.getHttpServer())
      .post('/farms')
      .send(createFarmDto)
      .expect(201)

    expect(response.body).toMatchObject(createFarmDto)
    expect(response.body).toHaveProperty('id')
  })

  it('/farms (POST) should return 400 if total area is less than sum of vegetation and agricultural areas', async () => {
    const createFarmDto = {
      total_area: 40,
      farm_name: 'Test Farm',
      vegetation_area: 20,
      agricultural_area: 30,
      city_id: cityId,
      producer_id: producerId,
    }

    await request(app.getHttpServer())
      .post('/farms')
      .send(createFarmDto)
      .expect(400)
  })

  it('/farms (POST) should return 404 if city does not exist', async () => {
    const createFarmDto = {
      total_area: 100,
      farm_name: 'Test Farm',
      vegetation_area: 20,
      agricultural_area: 30,
      city_id: 'nonexistent-city-id',
      producer_id: producerId,
    }

    await request(app.getHttpServer())
      .post('/farms')
      .send(createFarmDto)
      .expect(404)
  })

  it('/farms (GET) should return an array of farms', async () => {
    const farm1 = {
      total_area: 100,
      farm_name: 'Farm One',
      vegetation_area: 20,
      agricultural_area: 30,
      city_id: cityId,
      producer_id: producerId,
    }
    const farm2 = {
      total_area: 200,
      farm_name: 'Farm Two',
      vegetation_area: 40,
      agricultural_area: 60,
      city_id: cityId,
      producer_id: producerId,
    }

    await request(app.getHttpServer()).post('/farms').send(farm1)
    await request(app.getHttpServer()).post('/farms').send(farm2)

    const response = await request(app.getHttpServer())
      .get('/farms')
      .expect(200)

    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toMatchObject(farm1)
    expect(response.body[1]).toMatchObject(farm2)
  })

  it('/farms/:id (GET) should return a farm by ID', async () => {
    const createFarmDto = {
      total_area: 150,
      farm_name: 'Farm Three',
      vegetation_area: 30,
      agricultural_area: 40,
      city_id: cityId,
      producer_id: producerId,
    }
    const createdFarm = await request(app.getHttpServer())
      .post('/farms')
      .send(createFarmDto)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/farms/${createdFarm.body.id}`)
      .expect(200)

    expect(response.body).toMatchObject(createFarmDto)
    expect(response.body).toHaveProperty('id', createdFarm.body.id)
  })

  it('/farms/:id (GET) should return 404 if farm not found', async () => {
    await request(app.getHttpServer()).get('/farms/nonexistent-id').expect(404)
  })

  it('/farms/:id (PATCH) should update a farm', async () => {
    const createFarmDto = {
      total_area: 100,
      farm_name: 'Farm Four',
      vegetation_area: 20,
      agricultural_area: 30,
      city_id: cityId,
      producer_id: producerId,
    }
    const createdFarm = await request(app.getHttpServer())
      .post('/farms')
      .send(createFarmDto)
      .expect(201)

    const updateFarmDto = { farm_name: 'Updated Farm Four' }
    const response = await request(app.getHttpServer())
      .patch(`/farms/${createdFarm.body.id}`)
      .send(updateFarmDto)
      .expect(200)

    expect(response.body).toMatchObject({ ...createFarmDto, ...updateFarmDto })
    expect(response.body).toHaveProperty('id', createdFarm.body.id)
  })

  it('/farms/:id (PATCH) should return 404 if farm not found', async () => {
    await request(app.getHttpServer())
      .patch('/farms/nonexistent-id')
      .send({ farm_name: 'Updated' })
      .expect(404)
  })

  it('/farms/:id (PATCH) should return 400 if updated areas exceed total area', async () => {
    const createFarmDto = {
      total_area: 100,
      farm_name: 'Farm Five',
      vegetation_area: 20,
      agricultural_area: 30,
      city_id: cityId,
      producer_id: producerId,
    }
    const createdFarm = await request(app.getHttpServer())
      .post('/farms')
      .send(createFarmDto)
      .expect(201)

    const updateFarmDto = { vegetation_area: 60, agricultural_area: 50 } // Sum is 110, exceeds 100

    await request(app.getHttpServer())
      .patch(`/farms/${createdFarm.body.id}`)
      .send(updateFarmDto)
      .expect(400)
  })

  it('/farms/:id (PATCH) should return 404 if updated city does not exist', async () => {
    const createFarmDto = {
      total_area: 100,
      farm_name: 'Farm Five',
      vegetation_area: 20,
      agricultural_area: 30,
      city_id: cityId,
      producer_id: producerId,
    }
    const createdFarm = await request(app.getHttpServer())
      .post('/farms')
      .send(createFarmDto)
      .expect(201)

    const updateFarmDto = { city_id: 'nonexistent-city-id' }

    await request(app.getHttpServer())
      .patch(`/farms/${createdFarm.body.id}`)
      .send(updateFarmDto)
      .expect(404)
  })

  it('/farms/:id (DELETE) should delete a farm', async () => {
    const createFarmDto = {
      total_area: 100,
      farm_name: 'Farm Six',
      vegetation_area: 20,
      agricultural_area: 30,
      city_id: cityId,
      producer_id: producerId,
    }
    const createdFarm = await request(app.getHttpServer())
      .post('/farms')
      .send(createFarmDto)
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/farms/${createdFarm.body.id}`)
      .expect(204)

    await request(app.getHttpServer())
      .get(`/farms/${createdFarm.body.id}`)
      .expect(404)
  })

  it('/farms/:id (DELETE) should return 404 if farm not found', async () => {
    await request(app.getHttpServer())
      .delete('/farms/nonexistent-id')
      .expect(404)
  })
})
