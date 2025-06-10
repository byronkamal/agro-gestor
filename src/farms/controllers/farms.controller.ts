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
import { FarmsService } from '../services/farms.service'
import { CreateFarmDto } from '../dtos/create-farm.dto'
import { UpdateFarmDto } from '../dtos/update-farm.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Farms')
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso.' })
  @ApiResponse({
    status: 400,
    description:
      'Requisição inválida: A soma das áreas de vegetação e agricultável excede a área total.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cidade ou Produtor não encontrado.',
  })
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmsService.create(createFarmDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as fazendas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de fazendas retornada com sucesso.',
  })
  findAll() {
    return this.farmsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma fazenda pelo ID' })
  @ApiResponse({ status: 200, description: 'Fazenda retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.farmsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma fazenda existente' })
  @ApiResponse({ status: 200, description: 'Fazenda atualizada com sucesso.' })
  @ApiResponse({
    status: 400,
    description:
      'Requisição inválida: A soma das áreas de vegetação e agricultável excede a área total.',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda, Cidade ou Produtor não encontrado.',
  })
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmsService.update(id, updateFarmDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma fazenda' })
  @ApiResponse({ status: 204, description: 'Fazenda removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  remove(@Param('id') id: string) {
    return this.farmsService.remove(id)
  }
}
