import { Body, Controller, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FILE_CHUNK_SIZE, FileApiDefinition } from '@think/domains';

import { JwtGuard } from '@guard/jwt.guard';
import { FileMerge, FileQuery } from '@helpers/file.helper/oss.client';
import { FileService } from '@services/file.service';

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

  /**
   * 请求后端签名前端直传
   */
  @Post(FileApiDefinition.ossSign.server)
  @UseGuards(JwtGuard)
  ossSign(@Body() data: FileQuery) {
    return this.fileService.ossSign(data);
  }

  /**
   * 请求后端对分片上传的文件进行签名
   */
  @Post(FileApiDefinition.ossChunk.server)
  @UseGuards(JwtGuard)
  ossChunk(@Body() data: FileQuery) {
    return this.fileService.ossChunk(data);
  }

  /**
   * 请求后端合并分片上传的文件
   */
  @Post(FileApiDefinition.ossMerge.server)
  @UseGuards(JwtGuard)
  ossMerge(@Body() data: FileMerge) {
    return this.fileService.ossMerge(data);
  }
}
