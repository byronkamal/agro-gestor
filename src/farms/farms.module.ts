import { Module } from '@nestjs/common'
import { FarmsController } from './controllers/farms.controller'
import { FarmsService } from './services/farms.service'
import { PrismaModule } from '../prisma/prisma.module'
import { IFarmsRepository } from './repositories/farms.repository'
import { FarmsRepository } from './repositories/farms.prisma.repository'
import { CitiesModule } from '../cities/cities.module'
import { ICitiesRepository } from '../cities/repositories/cities.repository'
import { CitiesRepository } from '../cities/repositories/cities.prisma.repository'

@Module({
  imports: [PrismaModule, CitiesModule],
  controllers: [FarmsController],
  providers: [
    FarmsService,
    {
      provide: IFarmsRepository,
      useClass: FarmsRepository,
    },
    {
      provide: ICitiesRepository,
      useClass: CitiesRepository,
    },
  ],
  exports: [FarmsService],
})
export class FarmsModule {}
