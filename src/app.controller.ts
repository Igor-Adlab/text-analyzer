import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ExtrationRequestDto } from './dtos/extraction-request.dto';

@ApiTags('api')
@Controller({
  version: '1',
  path: 'extract'
})
export class AppController {
  constructor(private readonly service: AppService) {}

  @Post()
  async extract(
    @Body() dto: ExtrationRequestDto,
  ): Promise<any> {
    return this.service.extract(dto);
  }
}
