import _copy from "copy-to-clipboard";
import { Toast } from "@douyinfe/semi-ui";

export function copy(text: string, msg = "复制成功") {
  Toast.success(msg);
  return _copy(text);
}
