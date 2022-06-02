export const DEFAULT_WIKI_AVATAR = 'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default0-96.png';

export const WIKI_AVATARS = [
  DEFAULT_WIKI_AVATAR,
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default2-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default7-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default8-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default14-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default21-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default23-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default1-96%20(1).png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default4-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default12-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default17-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default18-96.png',
];

export const EMPTY_DOCUMNENT = {
  content: JSON.stringify({
    default: {
      type: 'doc',
      content: [{ type: 'title', content: [{ type: 'text', text: '未命名文档' }] }],
    },
  }),
  state: Buffer.from(
    new Uint8Array([
      1, 14, 204, 224, 154, 225, 13, 0, 7, 1, 7, 100, 101, 102, 97, 117, 108, 116, 3, 5, 116, 105, 116, 108, 101, 1, 0,
      204, 224, 154, 225, 13, 0, 1, 0, 1, 135, 204, 224, 154, 225, 13, 0, 3, 9, 112, 97, 114, 97, 103, 114, 97, 112,
      104, 40, 0, 204, 224, 154, 225, 13, 3, 6, 105, 110, 100, 101, 110, 116, 1, 125, 0, 40, 0, 204, 224, 154, 225, 13,
      3, 9, 116, 101, 120, 116, 65, 108, 105, 103, 110, 1, 119, 4, 108, 101, 102, 116, 0, 4, 71, 204, 224, 154, 225, 13,
      1, 6, 1, 0, 204, 224, 154, 225, 13, 10, 3, 132, 204, 224, 154, 225, 13, 13, 3, 230, 156, 170, 129, 204, 224, 154,
      225, 13, 14, 6, 132, 204, 224, 154, 225, 13, 20, 6, 229, 145, 189, 229, 144, 141, 129, 204, 224, 154, 225, 13, 22,
      5, 132, 204, 224, 154, 225, 13, 27, 6, 230, 150, 135, 230, 161, 163, 1, 204, 224, 154, 225, 13, 5, 1, 2, 6, 4, 11,
      3, 15, 6, 23, 5,
    ])
  ),
};

export const DOCUMENT_COVERS = [
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default2-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default7-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default8-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default14-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default21-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default23-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default1-96%20(1).png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default4-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default12-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default17-96.png',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-02-01/default18-96.png',
];
