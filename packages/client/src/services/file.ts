import { Toast } from '@douyinfe/semi-ui';

import { FILE_CHUNK_SIZE, FileApiDefinition } from '@think/domains';

import axios from 'axios';
import { url } from 'inspector';
import { string } from 'lib0';
import { timeout } from 'lib0/eventloop';
import SparkMD5 from 'spark-md5';

import { HttpClient } from './http-client';

const splitBigFile = (file: File): Promise<{ chunks: File[]; md5: string }> => {
  return new Promise((resolve) => {
    const chunks = [];
    const len = Math.ceil(file.size / FILE_CHUNK_SIZE);
    const sparkWorker = new Worker(new URL('./spark-md5.js', import.meta.url));
    sparkWorker.onmessage = (evt) => {
      resolve({ md5: evt.data.md5, chunks });
    };

    for (let i = 0; i < len; i++) {
      const start = i * FILE_CHUNK_SIZE;
      const end = Math.min(start + FILE_CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      chunks.push(chunk);
    }

    sparkWorker.postMessage({ chunks });
  });
};

const uploadFileToServer = (arg: {
  filename: string;
  file: File;
  md5: string;
  isChunk?: boolean;
  chunkIndex?: number;
  onUploadProgress?: (progress: number) => void;
}) => {
  const { filename, file, md5, isChunk, chunkIndex, onUploadProgress } = arg;
  const api = isChunk ? 'uploadChunk' : 'upload';
  const formData = new FormData();
  formData.append('file', file);

  return HttpClient.request<string>({
    method: FileApiDefinition[api].method,
    url: FileApiDefinition[api].client(),
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: {
      filename,
      md5,
      chunkIndex,
    },
    timeout: 30 * 1000,
    onUploadProgress: (progress) => {
      const percent = progress.loaded / progress.total;
      onUploadProgress && onUploadProgress(percent);
    },
  });
};

export const uploadFile = async (
  file: File,
  onUploadProgress?: (progress: number) => void,
  onTooLarge?: () => void
): Promise<string> => {
  const wraponUploadProgress = (percent) => {
    return onUploadProgress && onUploadProgress(Math.ceil(percent * 100));
  };

  // 开启s3 文件上传支持
  if (!process.env.ENABLE_OSS_S3) {
    const filename = file.name;
    console.debug('当前没有开启oss 对象存储,使用本地上传方案');
    if (file.size > FILE_CHUNK_SIZE) {
      onTooLarge && onTooLarge();
    }

    if (file.size <= FILE_CHUNK_SIZE) {
      const spark = new SparkMD5();
      spark.append(file);
      spark.append(file.lastModified);
      spark.append(file.type);
      const md5 = spark.end();
      const url = await uploadFileToServer({ filename, file, md5, onUploadProgress: wraponUploadProgress });
      return url;
    } else {
      const { chunks, md5 } = await splitBigFile(file);
      const unitPercent = 1 / chunks.length;
      const progressMap = {};

      let url = await HttpClient.request<string | undefined>({
        method: FileApiDefinition.initChunk.method,
        url: FileApiDefinition.initChunk.client(),
        params: {
          filename,
          md5,
        },
      });

      if (!url) {
        await Promise.all(
          chunks.map((chunk, index) => {
            return uploadFileToServer({
              filename,
              file: chunk,
              chunkIndex: index + 1,
              md5,
              isChunk: true,
              onUploadProgress: (progress) => {
                progressMap[index] = progress * unitPercent;
                wraponUploadProgress(
                  Math.min(
                    Object.keys(progressMap).reduce((a, c) => {
                      return (a += progressMap[c]);
                    }, 0),
                    // 剩下的 5% 交给 merge
                    0.95
                  )
                );
              },
            });
          })
        );
        url = await HttpClient.request({
          method: FileApiDefinition.mergeChunk.method,
          url: FileApiDefinition.mergeChunk.client(),
          params: {
            filename,
            md5,
          },
        });
      }
      wraponUploadProgress(1);
      return url;
    }
  }
  // S3 后端签名 前端文件直传 方案
  else {
    // 前端计算文件的md5
    console.log('计算待上传的文件{' + file.name + '}的md5...');
    const { chunks, md5 } = await splitBigFile(file);
    console.log('文件{' + file.name + '}的md5:' + md5);
    const filename = file.name;

    // 请求后端检查指定的文件是不是已经存在
    const res = await HttpClient.request({
      method: FileApiDefinition.ossSign.method,
      url: FileApiDefinition.ossSign.client(),
      data: { filename, md5, fileSize: file.size },
    });
    // 如果后端反应文件已经存在
    if (res['isExist']) {
      Toast.info('文件秒传成功!');
      return res['objectUrl'];
    } else {
      //console.log('文件不存在,需要上传文件');
      // 后端认为文件小,前端直接put 上传
      if (!res['MultipartUpload']) {
        console.log('前端直接PUT上传文件');
        const signUrl = res['signUrl'];
        await axios.put(signUrl, file, {
          timeout: 120 * 1000,
          onUploadProgress: (process) => {
            const uploadLoaded = process.loaded;
            const uploadTotal = file.size;
            const uploadPercent = uploadLoaded / uploadTotal;
            wraponUploadProgress(uploadPercent);
          },
        });
        const upres = await HttpClient.request({
          method: FileApiDefinition.ossSign.method,
          url: FileApiDefinition.ossSign.client(),
          data: { filename, md5, fileSize: file.size },
        });
        return upres['objectUrl'];
      }
      // 前端进入分片上传流程
      else {
        const upload_id = res['uploadId'];
        // console.log('分片文件上传,upload_id:' + upload_id);
        const MultipartUpload = [];
        for (let index = 0; index < chunks.length; index++) {
          const chunk = chunks[index];
          const res = await HttpClient.request({
            method: FileApiDefinition.ossChunk.method,
            url: FileApiDefinition.ossChunk.client(),
            data: { filename, md5, uploadId: upload_id, chunkIndex: index + 1 },
          });
          // 上传文件分块到s3
          // 直接用原生请求不走拦截器
          const upload_res = await axios.put(res['signUrl'], chunk, {
            timeout: 120 * 1000,
            onUploadProgress: (process) => {
              const uploadLoaded = process.loaded + FILE_CHUNK_SIZE * index;
              const uploadTotal = file.size;
              const uploadPercent = uploadLoaded / uploadTotal;
              //console.log(uploadLoaded, uploadTotal, uploadPercent);
              wraponUploadProgress(uploadPercent);
            },
          });
          const upload_etag = upload_res.headers['etag'];
          const response_part = { PartNumber: index + 1, ETag: upload_etag };
          MultipartUpload.push(response_part);
          //console.log('文件分片｛' + (index + 1) + '上传成功，etag:' + upload_etag);
        }
        // 文件已经全部上传OK
        // 请求后端合并文件
        const payload = { filename, md5, uploadId: upload_id, MultipartUpload };
        const upres = await HttpClient.request({
          method: FileApiDefinition.ossMerge.method,
          url: FileApiDefinition.ossMerge.client(),
          data: payload,
        });
        return '' + upres;
      }
    }
  }
};
