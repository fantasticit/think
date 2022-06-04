import { JwtGuard } from '@guard/jwt.guard';
import { FileQuery } from '@helpers/file.helper/oss.client';
import { Controller, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '@services/file.service';
import { FILE_CHUNK_SIZE, FileApiDefinition } from '@think/domains';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传小文件
   * @param file
   */
  @Post(FileApiDefinition.upload.server)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: FILE_CHUNK_SIZE,
      },
    })
  )
  @UseGuards(JwtGuard)
  uploadFile(@UploadedFile() file: Express.Multer.File, @Query() query: FileQuery) {
    return this.fileService.uploadFile(file, query);
  }

  /**
   * 初始分块文件
   * @param file
   */
  @Post(FileApiDefinition.initChunk.server)
  @UseGuards(JwtGuard)
  initChunk(@Query() query: FileQuery) {
    return this.fileService.initChunk(query);
  }

  /**
   * 上传分块文件
   * @param file
   */
  @Post(FileApiDefinition.uploadChunk.server)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: FILE_CHUNK_SIZE,
      },
    })
  )
  @UseGuards(JwtGuard)
  uploadChunk(@UploadedFile() file: Express.Multer.File, @Query() query: FileQuery) {
    return this.fileService.uploadChunk(file, query);
  }

  /**
   * 合并分块文件
   * @param file
   */
  @Post(FileApiDefinition.mergeChunk.server)
  @UseGuards(JwtGuard)
  mergeChunk(@Query() query: FileQuery) {
    return this.fileService.mergeChunk(query);
  }
}
