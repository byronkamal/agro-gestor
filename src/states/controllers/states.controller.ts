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
import { StatesService } from '../services/states.service'
import { CreateStateDto } from '../dtos/create-state.dto'
import { UpdateStateDto } from '../dtos/update-state.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('States')
@Controller('states')
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo estado' })
  @ApiResponse({ status: 201, description: 'Estado criado com sucesso.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Estado com o mesmo nome ou sigla já existe.',
  })
  create(@Body() createStateDto: CreateStateDto) {
    return this.statesService.create(createStateDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os estados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados retornada com sucesso.',
  })
  findAll() {
    return this.statesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um estado pelo ID' })
  @ApiResponse({ status: 200, description: 'Estado retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Estado não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.statesService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um estado existente' })
  @ApiResponse({ status: 200, description: 'Estado atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Estado não encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Estado com o mesmo nome ou sigla já existe.',
  })
  update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.statesService.update(id, updateStateDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um estado' })
  @ApiResponse({ status: 204, description: 'Estado removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Estado não encontrado.' })
  remove(@Param('id') id: string) {
    return this.statesService.remove(id)
  }
}
