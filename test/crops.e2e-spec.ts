import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

describe('CropsController (e2e)', () => {
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
    await prisma.crop.deleteMany()
  })

  afterAll(async () => {
    await prisma.crop.deleteMany()
    await app.close()
  })

  it('/crops (POST) should create a crop', async () => {
    const createCropDto = { name: 'Test Crop' }
    const response = await request(app.getHttpServer())
      .post('/crops')
      .send(createCropDto)
      .expect(201)

    expect(response.body).toMatchObject(createCropDto)
    expect(response.body).toHaveProperty('id')
  })

  it('/crops (POST) should return 409 if crop with name already exists', async () => {
    const createCropDto = { name: 'Test Crop' }
    await request(app.getHttpServer())
      .post('/crops')
      .send(createCropDto)
      .expect(201)

    await request(app.getHttpServer())
      .post('/crops')
      .send(createCropDto)
      .expect(409)
  })

  it('/crops (GET) should return an array of crops', async () => {
    const crop1 = { name: 'Crop One' }
    const crop2 = { name: 'Crop Two' }

    await request(app.getHttpServer()).post('/crops').send(crop1)
    await request(app.getHttpServer()).post('/crops').send(crop2)

    const response = await request(app.getHttpServer())
      .get('/crops')
      .expect(200)

    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toMatchObject(crop1)
    expect(response.body[1]).toMatchObject(crop2)
  })

  it('/crops/:id (GET) should return a crop by ID', async () => {
    const createCropDto = { name: 'Crop Three' }
    const createdCrop = await request(app.getHttpServer())
      .post('/crops')
      .send(createCropDto)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/crops/${createdCrop.body.id}`)
      .expect(200)

    expect(response.body).toMatchObject(createCropDto)
    expect(response.body).toHaveProperty('id', createdCrop.body.id)
  })

  it('/crops/:id (GET) should return 404 if crop not found', async () => {
    await request(app.getHttpServer()).get('/crops/nonexistent-id').expect(404)
  })

  it('/crops/:id (PATCH) should update a crop', async () => {
    const createCropDto = { name: 'Crop Four' }
    const createdCrop = await request(app.getHttpServer())
      .post('/crops')
      .send(createCropDto)
      .expect(201)

    const updateCropDto = { name: 'Updated Crop Four' }
    const response = await request(app.getHttpServer())
      .patch(`/crops/${createdCrop.body.id}`)
      .send(updateCropDto)
      .expect(200)

    expect(response.body).toMatchObject({ ...createCropDto, ...updateCropDto })
    expect(response.body).toHaveProperty('id', createdCrop.body.id)
  })

  it('/crops/:id (PATCH) should return 404 if crop not found', async () => {
    await request(app.getHttpServer())
      .patch('/crops/nonexistent-id')
      .send({ name: 'Updated' })
      .expect(404)
  })

  it('/crops/:id (PATCH) should return 409 if name already exists for another crop', async () => {
    const crop1 = { name: 'Crop Five' }
    const crop2 = { name: 'Crop Six' }

    const createdCrop1 = await request(app.getHttpServer())
      .post('/crops')
      .send(crop1)
      .expect(201)

    await request(app.getHttpServer()).post('/crops').send(crop2).expect(201)

    const updateCropDto = { name: crop2.name }
    await request(app.getHttpServer())
      .patch(`/crops/${createdCrop1.body.id}`)
      .send(updateCropDto)
      .expect(409)
  })

  it('/crops/:id (DELETE) should delete a crop', async () => {
    const createCropDto = { name: 'Crop Seven' }
    const createdCrop = await request(app.getHttpServer())
      .post('/crops')
      .send(createCropDto)
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/crops/${createdCrop.body.id}`)
      .expect(204)

    await request(app.getHttpServer())
      .get(`/crops/${createdCrop.body.id}`)
      .expect(404)
  })

  it('/crops/:id (DELETE) should return 404 if crop not found', async () => {
    await request(app.getHttpServer())
      .delete('/crops/nonexistent-id')
      .expect(404)
  })
})
