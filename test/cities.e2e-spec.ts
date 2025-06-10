import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

describe('CitiesController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let stateId: string

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

    // Create a state for foreign key constraint
    const state = await prisma.state.create({
      data: { name: 'Test State for City', acronym: 'TC' },
    })
    stateId = state.id
  })

  beforeEach(async () => {
    await prisma.city.deleteMany()
  })

  afterAll(async () => {
    await prisma.city.deleteMany()
    await prisma.state.deleteMany()
    await app.close()
  })

  it('/cities (POST) should create a city', async () => {
    const createCityDto = { name: 'Test City', state_id: stateId }
    const response = await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto)
      .expect(201)

    expect(response.body).toMatchObject(createCityDto)
    expect(response.body).toHaveProperty('id')
  })

  it('/cities (POST) should return 409 if city with name and state already exists', async () => {
    const createCityDto = { name: 'Existing City', state_id: stateId }
    await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto)
      .expect(201)

    await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto)
      .expect(409)
  })

  it('/cities (POST) should return 404 if state does not exist', async () => {
    const createCityDto = {
      name: 'City No State',
      state_id: 'nonexistent-state-id',
    }
    await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto)
      .expect(404)
  })

  it('/cities (GET) should return an array of cities', async () => {
    const city1 = { name: 'City A', state_id: stateId }
    const city2 = { name: 'City B', state_id: stateId }

    await request(app.getHttpServer()).post('/cities').send(city1)
    await request(app.getHttpServer()).post('/cities').send(city2)

    const response = await request(app.getHttpServer())
      .get('/cities')
      .expect(200)

    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toMatchObject(city1)
    expect(response.body[1]).toMatchObject(city2)
  })

  it('/cities/:id (GET) should return a city by ID', async () => {
    const createCityDto = { name: 'City C', state_id: stateId }
    const createdCity = await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/cities/${createdCity.body.id}`)
      .expect(200)

    expect(response.body).toMatchObject(createCityDto)
    expect(response.body).toHaveProperty('id', createdCity.body.id)
  })

  it('/cities/:id (GET) should return 404 if city not found', async () => {
    await request(app.getHttpServer()).get('/cities/nonexistent-id').expect(404)
  })

  it('/cities/:id (PATCH) should update a city', async () => {
    const createCityDto = { name: 'City D', state_id: stateId }
    const createdCity = await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto)
      .expect(201)

    const updateCityDto = { name: 'Updated City D' }
    const response = await request(app.getHttpServer())
      .patch(`/cities/${createdCity.body.id}`)
      .send(updateCityDto)
      .expect(200)

    expect(response.body).toMatchObject({ ...createCityDto, ...updateCityDto })
    expect(response.body).toHaveProperty('id', createdCity.body.id)
  })

  it('/cities/:id (PATCH) should return 404 if city not found', async () => {
    await request(app.getHttpServer())
      .patch('/cities/nonexistent-id')
      .send({ name: 'Updated' })
      .expect(404)
  })

  it('/cities/:id (PATCH) should return 409 if name and state already exist for another city', async () => {
    const createCityDto1 = { name: 'City E', state_id: stateId }
    const createCityDto2 = { name: 'City F', state_id: stateId }

    const createdCity1 = await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto1)
      .expect(201)

    await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto2)
      .expect(201)

    const updateCityDto = { name: createCityDto2.name }
    await request(app.getHttpServer())
      .patch(`/cities/${createdCity1.body.id}`)
      .send(updateCityDto)
      .expect(409)
  })

  it('/cities/:id (PATCH) should return 404 if updated state does not exist', async () => {
    const createCityDto = { name: 'City G', state_id: stateId }
    const createdCity = await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto)
      .expect(201)

    const updateCityDto = { state_id: 'nonexistent-state-id' }
    await request(app.getHttpServer())
      .patch(`/cities/${createdCity.body.id}`)
      .send(updateCityDto)
      .expect(404)
  })

  it('/cities/:id (DELETE) should delete a city', async () => {
    const createCityDto = { name: 'City H', state_id: stateId }
    const createdCity = await request(app.getHttpServer())
      .post('/cities')
      .send(createCityDto)
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/cities/${createdCity.body.id}`)
      .expect(204)

    await request(app.getHttpServer())
      .get(`/cities/${createdCity.body.id}`)
      .expect(404)
  })

  it('/cities/:id (DELETE) should return 404 if city not found', async () => {
    await request(app.getHttpServer())
      .delete('/cities/nonexistent-id')
      .expect(404)
  })
})
