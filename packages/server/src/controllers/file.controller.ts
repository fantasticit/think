import { JwtGuard } from '@guard/jwt.guard';
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@services/file.service';
import { FileApiDefinition } from '@think/domains';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传文件
   * @param file
   */
  @Post(FileApiDefinition.upload.server)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 50 * 1024 * 1024,
      },
    })
  )
  @UseGuards(JwtGuard)
  uploadFile(@UploadedFile() file) {
    return this.fileService.uploadFile(file);
  }
}
