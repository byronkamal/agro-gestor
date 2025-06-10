import { Module } from '@nestjs/common'
import { CropsController } from './controllers/crops.controller'
import { CropsService } from './services/crops.service'
import { PrismaModule } from '../prisma/prisma.module'
import { ICropsRepository } from './repositories/crops.repository'
import { CropsRepository } from './repositories/crops.prisma.repository'

@Module({
  imports: [PrismaModule],
  controllers: [CropsController],
  providers: [
    CropsService,
    {
      provide: ICropsRepository,
      useClass: CropsRepository,
    },
  ],
  exports: [CropsService],
})
export class CropsModule {}
