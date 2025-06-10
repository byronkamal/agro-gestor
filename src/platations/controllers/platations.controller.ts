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
import { PlatationsService } from '../services/platations.service'
import { CreatePlatationDto } from '../dtos/create-platation.dto'
import { UpdatePlatationDto } from '../dtos/update-platation.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Platations')
@Controller('platations')
export class PlatationsController {
  constructor(private readonly platationsService: PlatationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova plantação' })
  @ApiResponse({ status: 201, description: 'Plantação criada com sucesso.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Plantação com as mesmas chaves únicas já existe.',
  })
  @ApiResponse({
    status: 404,
    description: 'Fazenda, Cultura ou Colheita não encontrada.',
  })
  create(@Body() createPlatationDto: CreatePlatationDto) {
    return this.platationsService.create(createPlatationDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as plantações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plantações retornada com sucesso.',
  })
  findAll() {
    return this.platationsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma plantação pelo ID' })
  @ApiResponse({ status: 200, description: 'Plantação retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.platationsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma plantação existente' })
  @ApiResponse({
    status: 200,
    description: 'Plantação atualizada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Plantação, Fazenda, Cultura ou Colheita não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Plantação com as mesmas chaves únicas já existe.',
  })
  update(
    @Param('id') id: string,
    @Body() updatePlatationDto: UpdatePlatationDto,
  ) {
    return this.platationsService.update(id, updatePlatationDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma plantação' })
  @ApiResponse({ status: 204, description: 'Plantação removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Plantação não encontrada.' })
  remove(@Param('id') id: string) {
    return this.platationsService.remove(id)
  }
}
