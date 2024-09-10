
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

    /**
     * 后端签名生成需要上传的文件
     */
    ossSign:{
        method: "post";
        server: "upload/ossSign";
        client: () => string;
    };

    /**
     * 后端签名上传分片
     */
    ossChunk:{
        method: "post";
        server: "upload/ossChunk";
        client: () => string;
    };

    /**
     * 后端签名上传结束
     */
    ossMerge:{
        method: "post";
        server: "upload/ossMerge";
        client: () => string;
    };
    
};
export declare const FILE_CHUNK_SIZE: number;
