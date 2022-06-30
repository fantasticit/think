import { ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { SystemService } from '@services/system.service';
import { SystemApiDefinition } from '@think/domains';

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
