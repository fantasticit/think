export declare const FileApiDefinition: {
    /**
     * 上传文件
     */
    upload: {
        method: "post";
        server: "upload";
        client: () => string;
    };
    /**
     * 初始分块上传
     */
    initChunk: {
        method: "post";
        server: "upload/initChunk";
        client: () => string;
    };
    /**
     * 上传分块文件
     */
    uploadChunk: {
        method: "post";
        server: "upload/chunk";
        client: () => string;
    };
    /**
     * 合并分块文件
     */
    mergeChunk: {
        method: "post";
        server: "merge/chunk";
        client: () => string;
    };
    /**
     * OSS 签名
     */
    ossSign: {
        method: "post";
        server: "oss/sign";
        client: () => string;
    };
    /**
     * OSS 分块上传
     */
    ossChunk: {
        method: "post";
        server: "oss/chunk";
        client: () => string;
    };
    /**
     * OSS 合并分块
     */
    ossMerge: {
        method: "post";
        server: "oss/merge";
        client: () => string;
    };
};
export declare const FILE_CHUNK_SIZE: number;
