import FileSaver from 'file-saver';

export function download(url, name) {
  FileSaver.saveAs(url, name);
}
