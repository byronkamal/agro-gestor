import { Module } from '@nestjs/common'
import { ProducersController } from './controllers/producers.controller'
import { ProducersService } from './services/producers.service'
import { PrismaModule } from '../prisma/prisma.module'
import { IProducersRepository } from './repositories/producers.repository'
import { ProducersRepository } from './repositories/producers.prisma.repository'

@Module({
  imports: [PrismaModule],
  controllers: [ProducersController],
  providers: [
    ProducersService,
    {
      provide: IProducersRepository,
      useClass: ProducersRepository,
    },
  ],
  exports: [ProducersService],
})
export class ProducersModule {}
