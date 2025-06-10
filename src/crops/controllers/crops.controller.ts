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
import { CropsService } from '../services/crops.service'
import { CreateCropDto } from '../dtos/create-crop.dto'
import { UpdateCropDto } from '../dtos/update-crop.dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Crops')
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova cultura' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Cultura com o mesmo nome já existe.',
  })
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropsService.create(createCropDto)
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as culturas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de culturas retornada com sucesso.',
  })
  findAll() {
    return this.cropsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma cultura pelo ID' })
  @ApiResponse({ status: 200, description: 'Cultura retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.cropsService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma cultura existente' })
  @ApiResponse({ status: 200, description: 'Cultura atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.' })
  @ApiResponse({
    status: 409,
    description: 'Conflito: Cultura com o mesmo nome já existe.',
  })
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropsService.update(id, updateCropDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma cultura' })
  @ApiResponse({ status: 204, description: 'Cultura removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada.' })
  remove(@Param('id') id: string) {
    return this.cropsService.remove(id)
  }
}
