import { Controller } from '@nestjs/common';
import { SystemService } from '@services/system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}
}
