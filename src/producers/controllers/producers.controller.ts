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
import { ProducersService } from '../services/producers.service'
import { CreateProducerDto } from '../dtos/create-producer.dto'
import { UpdateProducerDto } from '../dtos/update-producer.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Producers')
@Controller('producers')
export class ProducersController {
  constructor(private readonly producersService: ProducersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo produtor rural' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Produtor com o mesmo documento já existe.',
  })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producersService.create(createProducerDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os produtores rurais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtores retornada com sucesso.',
  })
  findAll() {
    return this.producersService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um produtor rural pelo ID' })
  @ApiResponse({ status: 200, description: 'Produtor retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.producersService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um produtor rural existente' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Produtor com o mesmo documento já existe.',
  })
  update(
    @Param('id') id: string,
    @Body() updateProducerDto: UpdateProducerDto,
  ) {
    return this.producersService.update(id, updateProducerDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um produtor rural' })
  @ApiResponse({ status: 204, description: 'Produtor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  remove(@Param('id') id: string) {
    return this.producersService.remove(id)
  }
}
