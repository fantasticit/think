import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@services/file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传文件
   * @param file
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 50 * 1024 * 1024,
      },
    }),
  )
  @UseGuards(JwtGuard)
  uploadFile(@UploadedFile() file) {
    return this.fileService.uploadFile(file);
  }
}
