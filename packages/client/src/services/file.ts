import { string } from 'lib0';
import { HttpClient } from './HttpClient';

export const readFileAsDataURL = (file): Promise<string | ArrayBuffer> => {
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
