export enum AdType {
  shareDocCover = 'shareDocCover',
  shareDocAside = 'shareDocAside',
}

export interface IAd {
  id: string;
  type: AdType;
  cover: string;
  url: string;
}
