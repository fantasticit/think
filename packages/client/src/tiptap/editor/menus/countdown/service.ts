import { Editor } from 'tiptap/editor';
import { triggerOpenCountSettingModal } from '../_event';

/**
 * 新建倒计时
 * @param editor
 */
export const createCountdown = (editor: Editor) => {
  triggerOpenCountSettingModal(null);
};
