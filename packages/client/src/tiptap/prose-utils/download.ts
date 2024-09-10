import FileSaver from 'file-saver';

export function download(url, name) {
  if (url.startsWith('http://') || url.startsWith('https://')) window.open(url, '文件下载...');
  else FileSaver.saveAs(url, name);
}
