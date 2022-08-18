"use strict";
exports.__esModule = true;
exports.EMPTY_DOCUMNENT = exports.DOCUMENT_COVERS = exports.ORGANIZATION_LOGOS = exports.WIKI_AVATARS = exports.DEFAULT_WIKI_AVATAR = void 0;
exports.DEFAULT_WIKI_AVATAR = 'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/default7-97.png';
exports.WIKI_AVATARS = [exports.DEFAULT_WIKI_AVATAR];
exports.ORGANIZATION_LOGOS = [exports.DEFAULT_WIKI_AVATAR];
exports.DOCUMENT_COVERS = [
    'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1562380156-9a99cd92484c.avif',
    'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1510935813936-763eb6fbc613.avif',
    'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1517697471339-4aa32003c11a.avif',
    'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1622737133809-d95047b9e673.avif',
    'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1547891654-e66ed7ebb968.avif',
    'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1629461461750-ef5b81781bc2.avif',
];
exports.EMPTY_DOCUMNENT = {
    content: JSON.stringify({
        "default": {
            type: 'doc',
            content: [{ type: 'title', content: [{ type: 'text', text: '' }] }]
        }
    }),
    state: Buffer.from(new Uint8Array([]))
};
