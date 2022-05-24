"use strict";
exports.__esModule = true;
exports.FileApiDefinition = void 0;
exports.FileApiDefinition = {
    /**
     * 上传文件
     */
    upload: {
        method: 'post',
        server: 'upload',
        client: function () { return '/file/upload'; }
    }
};
