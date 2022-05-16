import { IconFile, IconImage, IconSong, IconVideo } from '@douyinfe/semi-icons';
import { normalizeFileType } from 'tiptap/prose-utils';

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
      return <IconFile />;

    default: {
      const value: never = type;
      throw new Error(value);
    }
  }
};
