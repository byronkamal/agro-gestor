import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IPlatationsRepository } from './platations.repository';
import { CreatePlatationDto } from '../dtos/create-platation.dto';
import { UpdatePlatationDto } from '../dtos/update-platation.dto';
import { Platation } from '../entities/platation.entity';

@Injectable()
export class PlatationsRepository implements IPlatationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePlatationDto): Promise<Platation> {
    return this.prisma.platation.create({ data });
  }

  async findAll(): Promise<Platation[]> {
    return this.prisma.platation.findMany({
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        harvest: true,
        crop: true,
      },
    });
  }

  async findById(id: string): Promise<Platation | null> {
    return this.prisma.platation.findUnique({
      where: { id },
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        harvest: true,
        crop: true,
      },
    });
  }

  async findByUniqueKeys(
    farm_id: string,
    crop_id: string,
    harvest_id: string,
  ): Promise<Platation | null> {
    return this.prisma.platation.findUnique({
      where: {
        farm_id_crop_id_harvest_id: {
          farm_id,
          crop_id,
          harvest_id,
        },
      },
    });
  }

  async update(id: string, data: UpdatePlatationDto): Promise<Platation> {
    return this.prisma.platation.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.platation.delete({ where: { id } });
  }
}
