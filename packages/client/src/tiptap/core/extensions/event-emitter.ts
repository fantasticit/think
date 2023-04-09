import { Extension } from '@tiptap/core';
import { EXTENSION_PRIORITY_HIGHEST } from 'tiptap/core/constants';

import { EventEmitter as Em } from 'helpers/event-emitter';

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
