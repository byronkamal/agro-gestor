import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

describe('StatesController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

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
  })

  beforeEach(async () => {
    await prisma.state.deleteMany()
  })

  afterAll(async () => {
    await prisma.state.deleteMany()
    await app.close()
  })

  it('/states (POST) should create a state', async () => {
    const createStateDto = { name: 'Test State', acronym: 'TS' }
    const response = await request(app.getHttpServer())
      .post('/states')
      .send(createStateDto)
      .expect(201)

    expect(response.body).toMatchObject(createStateDto)
    expect(response.body).toHaveProperty('id')
  })

  it('/states (POST) should return 409 if state with name already exists', async () => {
    const createStateDto = { name: 'Existing State', acronym: 'ES' }
    await request(app.getHttpServer())
      .post('/states')
      .send(createStateDto)
      .expect(201)

    await request(app.getHttpServer())
      .post('/states')
      .send(createStateDto)
      .expect(409)
  })

  it('/states (POST) should return 409 if state with acronym already exists', async () => {
    const createStateDto1 = { name: 'State One', acronym: 'SO' }
    const createStateDto2 = { name: 'State Two', acronym: 'SO' }
    await request(app.getHttpServer())
      .post('/states')
      .send(createStateDto1)
      .expect(201)

    await request(app.getHttpServer())
      .post('/states')
      .send(createStateDto2)
      .expect(409)
  })

  it('/states (GET) should return an array of states', async () => {
    const state1 = { name: 'State A', acronym: 'SA' }
    const state2 = { name: 'State B', acronym: 'SB' }

    await request(app.getHttpServer()).post('/states').send(state1)
    await request(app.getHttpServer()).post('/states').send(state2)

    const response = await request(app.getHttpServer())
      .get('/states')
      .expect(200)

    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toMatchObject(state1)
    expect(response.body[1]).toMatchObject(state2)
  })

  it('/states/:id (GET) should return a state by ID', async () => {
    const createStateDto = { name: 'State C', acronym: 'SC' }
    const createdState = await request(app.getHttpServer())
      .post('/states')
      .send(createStateDto)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/states/${createdState.body.id}`)
      .expect(200)

    expect(response.body).toMatchObject(createStateDto)
    expect(response.body).toHaveProperty('id', createdState.body.id)
  })

  it('/states/:id (GET) should return 404 if state not found', async () => {
    await request(app.getHttpServer()).get('/states/nonexistent-id').expect(404)
  })

  it('/states/:id (PATCH) should update a state', async () => {
    const createStateDto = { name: 'State D', acronym: 'SD' }
    const createdState = await request(app.getHttpServer())
      .post('/states')
      .send(createStateDto)
      .expect(201)

    const updateStateDto = { name: 'Updated State D' }
    const response = await request(app.getHttpServer())
      .patch(`/states/${createdState.body.id}`)
      .send(updateStateDto)
      .expect(200)

    expect(response.body).toMatchObject({
      ...createStateDto,
      ...updateStateDto,
    })
    expect(response.body).toHaveProperty('id', createdState.body.id)
  })

  it('/states/:id (PATCH) should return 404 if state not found', async () => {
    await request(app.getHttpServer())
      .patch('/states/nonexistent-id')
      .send({ name: 'Updated' })
      .expect(404)
  })

  it('/states/:id (PATCH) should return 409 if name already exists for another state', async () => {
    const state1 = { name: 'State E', acronym: 'SE' }
    const state2 = { name: 'State F', acronym: 'SF' }

    const createdState1 = await request(app.getHttpServer())
      .post('/states')
      .send(state1)
      .expect(201)

    await request(app.getHttpServer()).post('/states').send(state2).expect(201)

    const updateStateDto = { name: state2.name }
    await request(app.getHttpServer())
      .patch(`/states/${createdState1.body.id}`)
      .send(updateStateDto)
      .expect(409)
  })

  it('/states/:id (PATCH) should return 409 if acronym already exists for another state', async () => {
    const state1 = { name: 'State G', acronym: 'SG' }
    const state2 = { name: 'State H', acronym: 'SH' }

    const createdState1 = await request(app.getHttpServer())
      .post('/states')
      .send(state1)
      .expect(201)

    await request(app.getHttpServer()).post('/states').send(state2).expect(201)

    const updateStateDto = { acronym: state2.acronym }
    await request(app.getHttpServer())
      .patch(`/states/${createdState1.body.id}`)
      .send(updateStateDto)
      .expect(409)
  })

  it('/states/:id (DELETE) should delete a state', async () => {
    const createStateDto = { name: 'State I', acronym: 'SI' }
    const createdState = await request(app.getHttpServer())
      .post('/states')
      .send(createStateDto)
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/states/${createdState.body.id}`)
      .expect(204)

    await request(app.getHttpServer())
      .get(`/states/${createdState.body.id}`)
      .expect(404)
  })

  it('/states/:id (DELETE) should return 404 if state not found', async () => {
    await request(app.getHttpServer())
      .delete('/states/nonexistent-id')
      .expect(404)
  })
})
