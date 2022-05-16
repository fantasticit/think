import { Extension } from '@tiptap/core';
import { EditorState } from 'prosemirror-state';

import { yCursorPlugin } from './cursor-plugin';

type CollaborationCursorStorage = {
  users: { clientId: number; [key: string]: any }[];
};

export function findNodeAt(editor, state: EditorState, from, to) {
  let target = null;
  let pos = -1;

  if (editor && !editor.isDestroyed) {
    state.doc.nodesBetween(from, to, (node, p) => {
      target = node;
      pos = p;
      return true;
    });
  }

  return { node: target, pos };
}

export interface CollaborationCursorOptions {
  provider: any;
  user: Record<string, any>;
  render(user: Record<string, any>): HTMLElement;
  onUpdate: (users: { clientId: number; [key: string]: any }[]) => void;
  lockClassName?: string;
  lockedDOMNodes?: HTMLElement[]; // 锁定的DOM节点
  collaborationUserCursorCache?: Map<number, { user; cursor }>; // 协作用户的光标缓存
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    collaborationCursor: {
      /**
       * Update details of the current user
       */
      updateUser: (attributes: Record<string, any>) => ReturnType;
      /**
       * Update details of the current user
       *
       * @deprecated The "user" command is deprecated. Please use "updateUser" instead. Read more: https://tiptap.dev/api/extensions/collaboration-cursor
       */
      user: (attributes: Record<string, any>) => ReturnType;
    };
  }
}

const awarenessStatesToArray = (states: Map<number, Record<string, any>>) => {
  return Array.from(states.entries()).map(([key, value]) => {
    return {
      clientId: key,
      cursor: value.cursor,
      ...value.user,
    };
  });
};

const lockCollaborationUserEditingNodes = (extensionThis, users) => {
  const { editor, options } = extensionThis;

  if (!editor || editor.isDestroyed) {
    return;
  }

  while (options.lockedDOMNodes.length) {
    const dom = options.lockedDOMNodes.shift();
    dom && dom.classList && dom.classList.remove(options.lockClassName);

    dom.dataset.color = '';
    dom.dataset.name = '';
    // dom.dataset.name = user.name;
  }

  users.forEach((user) => {
    const cursor = user.cursor;
    if (!cursor && options.collaborationUserCursorCache.has(user.clientId)) {
      // 协作用户光标丢失，可能是进入自定义节点进行编辑了，读缓存的上一次光标
      user.cursor = options.collaborationUserCursorCache.get(user.clientId).cursor;
    }
  });

  if (users && users.length) {
    users.forEach((user) => {
      if (user.name === options.user.name) return;

      try {
        const cursor = user.cursor;
        if (cursor) {
          const { node, pos } = findNodeAt(editor, editor.state, cursor.originAnchor, cursor.originHead);

          if (node && node.isAtom) {
            const dom = editor.view.nodeDOM(pos) as HTMLElement;
            if (!dom || !dom.classList) return;
            dom.classList.add(options.lockClassName);
            dom.dataset.color = user.color;
            dom.dataset.name = user.name + '正在编辑中...';
            options.lockedDOMNodes.push(dom);
            options.collaborationUserCursorCache.set(user.clientId, { user, cursor });
          }
        }
      } catch (e) {
        //
      }
    });
  }
};

const defaultOnUpdate = () => null;

export const CollaborationCursor = Extension.create<CollaborationCursorOptions, CollaborationCursorStorage>({
  name: 'collaborationCursor',

  addOptions() {
    return {
      provider: null,
      user: {
        name: null,
        color: null,
      },
      render: (user) => {
        const cursor = document.createElement('span');

        cursor.classList.add('collaboration-cursor__caret');
        cursor.setAttribute('style', `border-color: ${user.color}`);

        const label = document.createElement('div');

        label.classList.add('collaboration-cursor__label');
        label.setAttribute('style', `background-color: ${user.color}`);
        label.insertBefore(document.createTextNode(user.name), null);
        cursor.insertBefore(label, null);

        return cursor;
      },
      onUpdate: defaultOnUpdate,
      lockClassName: 'is-locked',
      lockedDOMNodes: [],
      collaborationUserCursorCache: new Map(),
    };
  },

  addStorage() {
    return {
      users: [],
    };
  },

  addCommands() {
    return {
      updateUser: (attributes) => () => {
        this.options.user = attributes;
        this.options.provider.awareness.setLocalStateField('user', this.options.user);
        return true;
      },
      user:
        (attributes) =>
        ({ editor }) => {
          return editor.commands.updateUser(attributes);
        },
    };
  },

  addProseMirrorPlugins() {
    const extensionThis = this;
    const { isEditable } = this.editor;

    return [
      yCursorPlugin(
        (() => {
          this.options.provider.awareness.setLocalStateField('user', this.options.user);

          this.storage.users = awarenessStatesToArray(this.options.provider.awareness.states);

          this.options.provider.awareness.on('update', () => {
            const users = (this.storage.users = awarenessStatesToArray(this.options.provider.awareness.states));
            lockCollaborationUserEditingNodes(extensionThis, users);
            this.options.onUpdate(this.storage.users);
          });

          return this.options.provider.awareness;
        })(),
        // @ts-ignore
        {
          cursorBuilder: this.options.render,
        },
        'cursor',
        isEditable
      ),
    ];
  },
});
