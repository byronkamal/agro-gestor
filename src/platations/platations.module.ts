import { Module } from '@nestjs/common'
import { PlatationsController } from './controllers/platations.controller'
import { PlatationsService } from './services/platations.service'
import { PrismaModule } from '../prisma/prisma.module'
import { IPlatationsRepository } from './repositories/platations.repository'
import { PlatationsRepository } from './repositories/platations.prisma.repository'

@Module({
  imports: [PrismaModule],
  controllers: [PlatationsController],
  providers: [
    PlatationsService,
    {
      provide: IPlatationsRepository,
      useClass: PlatationsRepository,
    },
  ],
  exports: [PlatationsService],
})
export class PlatationsModule {}
