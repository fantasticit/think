"use strict";
exports.__esModule = true;
exports.FILE_CHUNK_SIZE = exports.FileApiDefinition = void 0;
exports.FileApiDefinition = {
    /**
     * 上传文件
     */
    upload: {
        method: 'post',
        server: 'upload',
        client: function () { return '/file/upload'; }
    },
    /**
     * 初始分块上传
     */
    initChunk: {
        method: 'post',
        server: 'upload/initChunk',
        client: function () { return '/file/upload/initChunk'; }
    },
    /**
     * 上传分块文件
     */
    uploadChunk: {
        method: 'post',
        server: 'upload/chunk',
        client: function () { return '/file/upload/chunk'; }
    },
    /**
     * 上传分块文件
     */
    mergeChunk: {
        method: 'post',
        server: 'merge/chunk',
        client: function () { return '/file/merge/chunk'; }
    }
};
exports.FILE_CHUNK_SIZE = 2 * 1024 * 1024;
