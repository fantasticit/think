import { HttpClient } from "./HttpClient";

export const uploadFile = async (file: Blob): Promise<string> => {
  if (process.env.ENABLE_ALIYUN_OSS) {
    return Promise.reject(
      new Error("阿里云OSS配置不完善，请自行实现上传文件！")
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  return HttpClient.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
