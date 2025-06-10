import { Module } from '@nestjs/common'
import { StatesController } from './controllers/states.controller'
import { StatesService } from './services/states.service'
import { PrismaModule } from '../prisma/prisma.module'
import { IStatesRepository } from './repositories/states.repository'
import { StatesRepository } from './repositories/states.prisma.repository'

@Module({
  imports: [PrismaModule],
  controllers: [StatesController],
  providers: [
    StatesService,
    {
      provide: IStatesRepository,
      useClass: StatesRepository,
    },
  ],
  exports: [StatesService],
})
export class StatesModule {}
