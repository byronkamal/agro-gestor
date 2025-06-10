import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ProducersModule } from './producers/producers.module'
import { PrismaModule } from './prisma/prisma.module'
import { FarmsModule } from './farms/farms.module'
import { CropsModule } from './crops/crops.module'
import { HarvestsModule } from './harvests/harvests.module'
import { PlatationsModule } from './platations/platations.module'
import { StatesModule } from './states/states.module'
import { CitiesModule } from './cities/cities.module'

@Module({
  imports: [
    ProducersModule,
    PrismaModule,
    FarmsModule,
    CropsModule,
    HarvestsModule,
    PlatationsModule,
    StatesModule,
    CitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
