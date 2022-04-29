/**
 * 获取文件名
 *
 * @example
 *   > extractFilename('https://gitlab.com/images/logo-full.png')
 *   < 'logo-full'
 *
 * @param {string} src The URL to extract filename from
 * @returns {string}
 */
export const extractFilename = (src) => {
  return src.replace(/^.*\/|\..+?$/g, '');
};

/**
 * 获取文件扩展名
 * @param {string} fileName 文件名
 * @returns  {string}
 */
export const extractFileExtension = (fileName) => {
  return fileName.split('.').pop();
};

export const normalizeFileSize = (size) => {
  if (size < 1024) {
    return size + ' Byte';
  }
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  }
  return (size / 1024 / 1024).toFixed(2) + ' MB';
};

export type FileType = 'image' | 'audio' | 'video' | 'pdf' | 'file';

export const normalizeFileType = (fileType): FileType => {
  if (!fileType) return 'file';

  if (fileType === 'application/pdf') return 'pdf';

  if (fileType.startsWith('image')) {
    return 'image';
  }

  if (fileType.startsWith('audio')) {
    return 'audio';
  }

  if (fileType.startsWith('video')) {
    return 'video';
  }

  return 'file';
};

export const readImageAsBase64 = (file: File): Promise<{ alt: string; src: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        resolve({
          alt: file.name,
          src: reader.result as string,
        });
      },
      false
    );
    reader.readAsDataURL(file);
  });
};

export const getImageWidthHeight = (url: string): Promise<{ width: number | string; height: number | string }> => {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      resolve({ width: 'auto', height: 'auto' });
    };
    img.src = url;
  });
};
