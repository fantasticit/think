import { EventEmitter } from 'helpers/event-emitter';
import { Editor } from 'tiptap/core';

const getEventEmitter = (editor: Editor): EventEmitter => {
  try {
    const event = editor.eventEmitter;
    return event;
  } catch (e) {
    throw new Error('未找到 EventEmitter 模块！');
  }
};

export const OPEN_COUNT_SETTING_MODAL = 'OPEN_COUNT_SETTING_MODAL';
export const OPEN_LINK_SETTING_MODAL = 'OPEN_LINK_SETTING_MODAL';
export const OPEN_FLOW_SETTING_MODAL = 'OPEN_FLOW_SETTING_MODAL';
export const OPEN_MIND_SETTING_MODAL = 'OPEN_MIND_SETTING_MODAL';
export const OPEN_EXCALIDRAW_SETTING_MODAL = 'OPEN_EXCALIDRAW_SETTING_MODAL';

export const subject = (editor: Editor, eventName, handler) => {
  const event = getEventEmitter(editor);
  event.on(eventName, handler);
};

export const cancelSubject = (editor: Editor, eventName, handler) => {
  const event = getEventEmitter(editor);
  event.off(eventName, handler);
};

export const triggerOpenCountSettingModal = (editor: Editor, data) => {
  const event = getEventEmitter(editor);
  event.emit(OPEN_COUNT_SETTING_MODAL, data);
};

export const triggerOpenLinkSettingModal = (editor: Editor, data) => {
  const event = getEventEmitter(editor);
  event.emit(OPEN_LINK_SETTING_MODAL, data);
};

export const triggerOpenFlowSettingModal = (editor: Editor, data) => {
  const event = getEventEmitter(editor);
  event.emit(OPEN_FLOW_SETTING_MODAL, data);
};

export const triggerOpenMindSettingModal = (editor: Editor, data) => {
  const event = getEventEmitter(editor);
  event.emit(OPEN_MIND_SETTING_MODAL, data);
};

export const triggerOpenExcalidrawSettingModal = (editor: Editor, data) => {
  const event = getEventEmitter(editor);
  event.emit(OPEN_EXCALIDRAW_SETTING_MODAL, data);
};
