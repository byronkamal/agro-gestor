import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

describe('HarvestsController (e2e)', () => {
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
    await prisma.harvest.deleteMany()
  })

  afterAll(async () => {
    await prisma.harvest.deleteMany()
    await app.close()
  })

  it('/harvests (POST) should create a harvest', async () => {
    const createHarvestDto = { name: 'Safra 2024', year: 2024 }
    const response = await request(app.getHttpServer())
      .post('/harvests')
      .send(createHarvestDto)
      .expect(201)

    expect(response.body).toMatchObject(createHarvestDto)
    expect(response.body).toHaveProperty('id')
  })

  it('/harvests (GET) should return an array of harvests', async () => {
    const harvest1 = { name: 'Safra 2023', year: 2023 }
    const harvest2 = { name: 'Safra 2022', year: 2022 }

    await request(app.getHttpServer()).post('/harvests').send(harvest1)
    await request(app.getHttpServer()).post('/harvests').send(harvest2)

    const response = await request(app.getHttpServer())
      .get('/harvests')
      .expect(200)

    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toMatchObject(harvest1)
    expect(response.body[1]).toMatchObject(harvest2)
  })

  it('/harvests/:id (GET) should return a harvest by ID', async () => {
    const createHarvestDto = { name: 'Safra 2025', year: 2025 }
    const createdHarvest = await request(app.getHttpServer())
      .post('/harvests')
      .send(createHarvestDto)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/harvests/${createdHarvest.body.id}`)
      .expect(200)

    expect(response.body).toMatchObject(createHarvestDto)
    expect(response.body).toHaveProperty('id', createdHarvest.body.id)
  })

  it('/harvests/:id (GET) should return 404 if harvest not found', async () => {
    await request(app.getHttpServer())
      .get('/harvests/nonexistent-id')
      .expect(404)
  })

  it('/harvests/:id (PATCH) should update a harvest', async () => {
    const createHarvestDto = { name: 'Safra 2026', year: 2026 }
    const createdHarvest = await request(app.getHttpServer())
      .post('/harvests')
      .send(createHarvestDto)
      .expect(201)

    const updateHarvestDto = { name: 'Updated Safra 2026' }
    const response = await request(app.getHttpServer())
      .patch(`/harvests/${createdHarvest.body.id}`)
      .send(updateHarvestDto)
      .expect(200)

    expect(response.body).toMatchObject({
      ...createHarvestDto,
      ...updateHarvestDto,
    })
    expect(response.body).toHaveProperty('id', createdHarvest.body.id)
  })

  it('/harvests/:id (PATCH) should return 404 if harvest not found', async () => {
    await request(app.getHttpServer())
      .patch('/harvests/nonexistent-id')
      .send({ name: 'Updated' })
      .expect(404)
  })

  it('/harvests/:id (DELETE) should delete a harvest', async () => {
    const createHarvestDto = { name: 'Safra 2027', year: 2027 }
    const createdHarvest = await request(app.getHttpServer())
      .post('/harvests')
      .send(createHarvestDto)
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/harvests/${createdHarvest.body.id}`)
      .expect(204)

    await request(app.getHttpServer())
      .get(`/harvests/${createdHarvest.body.id}`)
      .expect(404)
  })

  it('/harvests/:id (DELETE) should return 404 if harvest not found', async () => {
    await request(app.getHttpServer())
      .delete('/harvests/nonexistent-id')
      .expect(404)
  })
})
