import { Module } from '@nestjs/common'
import { HarvestsController } from './controllers/harvests.controller'
import { HarvestsService } from './services/harvests.service'
import { PrismaModule } from '../prisma/prisma.module'
import { IHarvestsRepository } from './repositories/harvests.repository'
import { HarvestsRepository } from './repositories/harvests.prisma.repository'

@Module({
  imports: [PrismaModule],
  controllers: [HarvestsController],
  providers: [
    HarvestsService,
    {
      provide: IHarvestsRepository,
      useClass: HarvestsRepository,
    },
  ],
  exports: [HarvestsService],
})
export class HarvestsModule {}
