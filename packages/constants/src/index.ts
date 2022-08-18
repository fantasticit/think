export const DEFAULT_WIKI_AVATAR = 'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/default7-97.png';

export const WIKI_AVATARS = [DEFAULT_WIKI_AVATAR];

export const ORGANIZATION_LOGOS = [DEFAULT_WIKI_AVATAR];

export const DOCUMENT_COVERS = [
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1562380156-9a99cd92484c.avif',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1510935813936-763eb6fbc613.avif',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1517697471339-4aa32003c11a.avif',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1622737133809-d95047b9e673.avif',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1547891654-e66ed7ebb968.avif',
  'https://wipi.oss-cn-shanghai.aliyuncs.com/2022-07-20/photo-1629461461750-ef5b81781bc2.avif',
];

export const EMPTY_DOCUMNENT = {
  content: JSON.stringify({
    default: {
      type: 'doc',
      content: [{ type: 'title', content: [{ type: 'text', text: '' }] }],
    },
  }),
  state: Buffer.from(new Uint8Array([])),
};
