import { FILE_CHUNK_SIZE, FileApiDefinition } from '@think/domains';
import { string } from 'lib0';
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

  const filename = file.name;

  if (file.size > FILE_CHUNK_SIZE * 5) {
    onTooLarge && onTooLarge();
  }

  if (file.size <= FILE_CHUNK_SIZE) {
    const spark = new SparkMD5.ArrayBuffer();
    spark.append(file);
    const md5 = spark.end();
    const url = await uploadFileToServer({ filename, file, md5, onUploadProgress: wraponUploadProgress });
    return url;
  } else {
    const { chunks, md5 } = await splitBigFile(file);
    const unitPercent = 1 / chunks.length;
    const progressMap = {};

    /**
     * 先上传一块分块，如果文件已上传，即无需上传后续分块
     */
    let url = await uploadFileToServer({
      filename,
      file: chunks[0],
      chunkIndex: 1,
      md5,
      isChunk: true,
      onUploadProgress: (progress) => {
        progressMap[1] = progress * unitPercent;
        wraponUploadProgress(
          Object.keys(progressMap).reduce((a, c) => {
            return (a += progressMap[c]);
          }, 0)
        );
      },
    });

    if (!url) {
      await Promise.all(
        chunks.slice(1).map((chunk, index) => {
          const currentIndex = 1 + index + 1;
          return uploadFileToServer({
            filename,
            file: chunk,
            chunkIndex: currentIndex,
            md5,
            isChunk: true,
            onUploadProgress: (progress) => {
              progressMap[currentIndex] = progress * unitPercent;
              wraponUploadProgress(
                Object.keys(progressMap).reduce((a, c) => {
                  return (a += progressMap[c]);
                }, 0)
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
    } else {
      wraponUploadProgress(1);
    }

    return url;
  }
};
