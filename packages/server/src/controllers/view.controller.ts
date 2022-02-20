import { Controller } from '@nestjs/common';
import { ViewService } from '@services/view.service';

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}
}
