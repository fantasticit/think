import { EventEmitter } from 'helpers/event-emitter';

export const event = new EventEmitter();

export const OPEN_COUNT_SETTING_MODAL = 'OPEN_COUNT_SETTING_MODAL';
export const triggerOpenCountSettingModal = (data) => {
  event.emit(OPEN_COUNT_SETTING_MODAL, data);
};
