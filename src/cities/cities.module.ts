import { Module } from '@nestjs/common'
import { CitiesController } from './controllers/cities.controller'
import { CitiesService } from './services/cities.service'
import { PrismaModule } from '../prisma/prisma.module'
import { ICitiesRepository } from './repositories/cities.repository'
import { CitiesRepository } from './repositories/cities.prisma.repository'
import { StatesModule } from '../states/states.module'
import { IStatesRepository } from '../states/repositories/states.repository'
import { StatesRepository } from '../states/repositories/states.prisma.repository'

@Module({
  imports: [PrismaModule, StatesModule],
  controllers: [CitiesController],
  providers: [
    CitiesService,
    {
      provide: ICitiesRepository,
      useClass: CitiesRepository,
    },
    {
      provide: IStatesRepository,
      useClass: StatesRepository,
    },
  ],
  exports: [CitiesService],
})
export class CitiesModule {}
