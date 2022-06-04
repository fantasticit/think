import { FILE_CHUNK_SIZE, FileApiDefinition } from '@think/domains';
import SparkMD5 from 'spark-md5';

import { HttpClient } from './http-client';

const splitBigFile = (file: File): Promise<{ chunks: File[]; md5: string }> => {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    const chunks = [];
    const len = Math.ceil(file.size / FILE_CHUNK_SIZE);
    let current = 0;

    fileReader.onload = (e) => {
      current++;

      const chunk = e.target.result;
      spark.append(chunk);

      if (current < len) {
        loadChunk();
      } else {
        resolve({ chunks, md5: spark.end() });
      }
    };

    fileReader.onerror = (err) => {
      reject(err);
    };

    const loadChunk = () => {
      const start = current * FILE_CHUNK_SIZE;
      const end = Math.min(start + FILE_CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      chunks.push(chunk);
      fileReader.readAsArrayBuffer(chunk);
    };

    loadChunk();
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

  return HttpClient.request({
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

export const uploadFile = async (file: File, onUploadProgress?: (progress: number) => void) => {
  const wraponUploadProgress = (percent) => {
    return onUploadProgress && onUploadProgress(Math.ceil(percent * 100));
  };

  const filename = file.name;
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

    await Promise.all(
      chunks.map((chunk, index) =>
        uploadFileToServer({
          filename,
          file: chunk,
          chunkIndex: index + 1,
          md5,
          isChunk: true,
          onUploadProgress: (progress) => {
            progressMap[index] = progress * unitPercent;
            wraponUploadProgress(
              Object.keys(progressMap).reduce((a, c) => {
                return (a += progressMap[c]);
              }, 0)
            );
          },
        })
      )
    );
    const url = await HttpClient.request({
      method: FileApiDefinition.mergeChunk.method,
      url: FileApiDefinition.mergeChunk.client(),
      params: {
        filename,
        md5,
      },
    });
    return url;
  }
};
