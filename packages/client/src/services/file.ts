import { getConfig } from "@think/config";
import { HttpClient } from "./HttpClient";

const config = getConfig();

// @ts-ignore
const hasOssConfig = config?.oss?.aliyun?.accessKeyId;

export const uploadFile = async (file: Blob): Promise<string> => {
  if (!hasOssConfig) {
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
