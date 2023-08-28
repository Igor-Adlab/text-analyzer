import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { ExtrationRequestDto } from './dtos/extraction-request.dto';
import { RadpiApiGuard } from './guards/radpi-api.guard';

@ApiTags('api')
@Controller({
  version: '1',
  path: 'extract'
})
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post()
  @UseGuards(RadpiApiGuard)
  @ApiHeader({
    required: true,
    allowEmptyValue: false,
    name: 'X-RapidAPI-Proxy-Secret',
    description: 'Rapid api proxy secret',
  })
  async extract(
    @Body() dto: ExtrationRequestDto,
  ): Promise<any> {
    return this.service.extract(dto);
  }
}
