import { Extension } from '@tiptap/core';
import { EventEmitter as Em } from 'helpers/event-emitter';
import { EXTENSION_PRIORITY_HIGHEST } from 'tiptap/core/constants';

const event = new Em();

/**
 * 添加事件能力
 */
export const EventEmitter = Extension.create({
  name: 'eventEmitter',
  priority: EXTENSION_PRIORITY_HIGHEST,
  addOptions() {
    return { eventEmitter: event };
  },
  addStorage() {
    return this.options;
  },
});
