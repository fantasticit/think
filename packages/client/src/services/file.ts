import { HttpClient } from './HttpClient';

const ONE_MB = 1 * 1024 * 1024;

export const readFileAsDataURL = (file): Promise<string | ArrayBuffer> => {
  if (file.size > ONE_MB) {
    return Promise.reject(new Error('文件过大，请实现文件上传到存储服务！'));
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', (e) => resolve(e.target.result), { once: true });
    reader.readAsDataURL(file);
  });
};

export const uploadFile = async (file: Blob): Promise<string | ArrayBuffer> => {
  if (!process.env.ENABLE_ALIYUN_OSS) {
    return readFileAsDataURL(file);
  }

  const formData = new FormData();
  formData.append('file', file);

  return HttpClient.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
