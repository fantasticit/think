import _copy from './copy-to-clipboard';
import { Toast } from '@douyinfe/semi-ui';

interface Options {
  debug?: boolean;
  message?: string;
  format?: string; // MIME type
  onCopy?: (clipboardData: object) => void;
}

export function copy(text: string | { text: string; format: string }[], options?: Options) {
  options = options || {};
  options.onCopy = options.onCopy || (() => Toast.success(options.message || '复制成功'));
  options.format = options.format || 'text/plain';
  return _copy(text, options);
}
