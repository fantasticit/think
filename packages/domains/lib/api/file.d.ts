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
     * 上传分块文件
     */
    mergeChunk: {
        method: "post";
        server: "merge/chunk";
        client: () => string;
    };
};
export declare const FILE_CHUNK_SIZE: number;
