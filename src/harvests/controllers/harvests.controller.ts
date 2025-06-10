import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { HarvestsService } from '../services/harvests.service'
import { CreateHarvestDto } from '../dtos/create-harvest.dto'
import { UpdateHarvestDto } from '../dtos/update-harvest.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Harvests')
@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova colheita' })
  @ApiResponse({ status: 201, description: 'Colheita criada com sucesso.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Colheita com o mesmo nome e ano já existe.',
  })
  create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestsService.create(createHarvestDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as colheitas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de colheitas retornada com sucesso.',
  })
  findAll() {
    return this.harvestsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma colheita pelo ID' })
  @ApiResponse({ status: 200, description: 'Colheita retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.harvestsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma colheita existente' })
  @ApiResponse({ status: 200, description: 'Colheita atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Colheita com o mesmo nome e ano já existe.',
  })
  update(@Param('id') id: string, @Body() updateHarvestDto: UpdateHarvestDto) {
    return this.harvestsService.update(id, updateHarvestDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma colheita' })
  @ApiResponse({ status: 204, description: 'Colheita removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  remove(@Param('id') id: string) {
    return this.harvestsService.remove(id)
  }
}
