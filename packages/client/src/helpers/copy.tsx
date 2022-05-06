import _copy from './copy-to-clipboard';
import { Toast } from '@douyinfe/semi-ui';

export function copy(text: string | { text: string; format: string }[]) {
  return _copy(text, () => Toast.success('复制成功'));
}
