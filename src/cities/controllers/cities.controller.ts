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
import { CitiesService } from '../services/cities.service'
import { CreateCityDto } from '../dtos/create-city.dto'
import { UpdateCityDto } from '../dtos/update-city.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova cidade' })
  @ApiResponse({ status: 201, description: 'Cidade criada com sucesso.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Cidade com o mesmo nome e estado já existe.',
  })
  @ApiResponse({ status: 404, description: 'Estado não encontrado.' })
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as cidades' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cidades retornada com sucesso.',
  })
  findAll() {
    return this.citiesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma cidade pelo ID' })
  @ApiResponse({ status: 200, description: 'Cidade retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cidade não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma cidade existente' })
  @ApiResponse({ status: 200, description: 'Cidade atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cidade ou Estado não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Cidade com o mesmo nome e estado já existe.',
  })
  update(@Param('id') id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma cidade' })
  @ApiResponse({ status: 204, description: 'Cidade removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cidade não encontrada.' })
  remove(@Param('id') id: string) {
    return this.citiesService.remove(id)
  }
}
