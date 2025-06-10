import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'

describe('ProducersController (e2e)', () => {
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
    await prisma.producer.deleteMany()
  })

  afterAll(async () => {
    await prisma.producer.deleteMany()
    await app.close()
  })

  it('/producers (POST) should create a producer', async () => {
    const createProducerDto = {
      document: '12345678900',
      name: 'Test Producer',
      document_type: 'CPF',
    }
    const response = await request(app.getHttpServer())
      .post('/producers')
      .send(createProducerDto)
      .expect(201)

    expect(response.body).toMatchObject(createProducerDto)
    expect(response.body).toHaveProperty('id')
  })

  it('/producers (POST) should return 409 if producer with document already exists', async () => {
    const createProducerDto = {
      document: '12345678900',
      name: 'Test Producer',
      document_type: 'CPF',
    }
    await request(app.getHttpServer())
      .post('/producers')
      .send(createProducerDto)
      .expect(201)

    await request(app.getHttpServer())
      .post('/producers')
      .send(createProducerDto)
      .expect(409)
  })

  it('/producers (GET) should return an array of producers', async () => {
    const producer1 = {
      document: '11111111111',
      name: 'Producer One',
      document_type: 'CPF',
    }
    const producer2 = {
      document: '22222222222',
      name: 'Producer Two',
      document_type: 'CPF',
    }

    await request(app.getHttpServer()).post('/producers').send(producer1)
    await request(app.getHttpServer()).post('/producers').send(producer2)

    const response = await request(app.getHttpServer())
      .get('/producers')
      .expect(200)

    expect(response.body).toHaveLength(2)
    expect(response.body[0]).toMatchObject(producer1)
    expect(response.body[1]).toMatchObject(producer2)
  })

  it('/producers/:id (GET) should return a producer by ID', async () => {
    const createProducerDto = {
      document: '33333333333',
      name: 'Producer Three',
      document_type: 'CPF',
    }
    const createdProducer = await request(app.getHttpServer())
      .post('/producers')
      .send(createProducerDto)
      .expect(201)

    const response = await request(app.getHttpServer())
      .get(`/producers/${createdProducer.body.id}`)
      .expect(200)

    expect(response.body).toMatchObject(createProducerDto)
    expect(response.body).toHaveProperty('id', createdProducer.body.id)
  })

  it('/producers/:id (GET) should return 404 if producer not found', async () => {
    await request(app.getHttpServer())
      .get('/producers/nonexistent-id')
      .expect(404)
  })

  it('/producers/:id (PATCH) should update a producer', async () => {
    const createProducerDto = {
      document: '44444444444',
      name: 'Producer Four',
      document_type: 'CPF',
    }
    const createdProducer = await request(app.getHttpServer())
      .post('/producers')
      .send(createProducerDto)
      .expect(201)

    const updateProducerDto = { name: 'Updated Producer Four' }
    const response = await request(app.getHttpServer())
      .patch(`/producers/${createdProducer.body.id}`)
      .send(updateProducerDto)
      .expect(200)

    expect(response.body).toMatchObject({
      ...createProducerDto,
      ...updateProducerDto,
    })
    expect(response.body).toHaveProperty('id', createdProducer.body.id)
  })

  it('/producers/:id (PATCH) should return 404 if producer not found', async () => {
    await request(app.getHttpServer())
      .patch('/producers/nonexistent-id')
      .send({ name: 'Updated' })
      .expect(404)
  })

  it('/producers/:id (PATCH) should return 409 if document already exists for another producer', async () => {
    const producer1 = {
      document: '55555555555',
      name: 'Producer Five',
      document_type: 'CPF',
    }
    const producer2 = {
      document: '66666666666',
      name: 'Producer Six',
      document_type: 'CPF',
    }

    const createdProducer1 = await request(app.getHttpServer())
      .post('/producers')
      .send(producer1)
      .expect(201)

    await request(app.getHttpServer())
      .post('/producers')
      .send(producer2)
      .expect(201)

    const updateProducerDto = { document: producer2.document }
    await request(app.getHttpServer())
      .patch(`/producers/${createdProducer1.body.id}`)
      .send(updateProducerDto)
      .expect(409)
  })

  it('/producers/:id (DELETE) should delete a producer', async () => {
    const createProducerDto = {
      document: '77777777777',
      name: 'Producer Seven',
      document_type: 'CPF',
    }
    const createdProducer = await request(app.getHttpServer())
      .post('/producers')
      .send(createProducerDto)
      .expect(201)

    await request(app.getHttpServer())
      .delete(`/producers/${createdProducer.body.id}`)
      .expect(204)

    await request(app.getHttpServer())
      .get(`/producers/${createdProducer.body.id}`)
      .expect(404)
  })

  it('/producers/:id (DELETE) should return 404 if producer not found', async () => {
    await request(app.getHttpServer())
      .delete('/producers/nonexistent-id')
      .expect(404)
  })
})
