import { Toast } from '@douyinfe/semi-ui';

import _copy from './copy-to-clipboard';

export function copy(text: string | { text: string; format: string }[]) {
  return _copy(text, () => Toast.success('复制成功'));
}
