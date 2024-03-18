import { IconFile, IconImage, IconSong, IconVideo } from '@douyinfe/semi-icons';

import { normalizeFileType } from 'tiptap/prose-utils';

import { IconFilePDF, IconFilePPT, IconFileSheet, IconFileWord } from 'components/icons';

export const getFileTypeIcon = (fileType: string) => {
  const type = normalizeFileType(fileType);

  switch (type) {
    case 'audio':
      return <IconSong />;

    case 'video':
      return <IconVideo />;

    case 'file':
      return <IconFile />;

    case 'image':
      return <IconImage />;

    case 'pdf':
      return <IconFilePDF />;

    case 'word':
      return <IconFileWord />;

    case 'excel':
      return <IconFileSheet />;

    case 'ppt':
      return <IconFilePPT />;

    default: {
      const value: never = type;
      throw new Error(value);
    }
  }
};
