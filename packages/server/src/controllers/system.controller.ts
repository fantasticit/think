import { ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';

import { SystemApiDefinition } from '@think/domains';

import { SystemService } from '@services/system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(SystemApiDefinition.getPublicConfig.server)
  @HttpCode(HttpStatus.CREATED)
  async getPublicConfig() {
    return await this.systemService.getPublicConfig();
  }
}
