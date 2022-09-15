import { EditorOptions } from '@tiptap/core';
import { Editor as BuiltInEditor } from '@tiptap/react';
import { EditorContent, NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { EventEmitter } from 'helpers/event-emitter';
import { throttle } from 'helpers/throttle';
import { DependencyList, useEffect, useState } from 'react';

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export class Editor extends BuiltInEditor {
  public eventEmitter: EventEmitter = new EventEmitter();
}

export const createEditor = (options: Partial<EditorOptions> = {}) => {
  return new Editor(options);
};

export const useEditor = (options: Partial<EditorOptions> = {}, deps: DependencyList = []) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    options.editorProps = options.editorProps || {};

    if (options.editable) {
      options.editorProps.attributes = options.editorProps.attributes || {
        spellcheck: 'false',
      };
      // @ts-ignore
      options.editorProps.attributes.class = options.editorProps.attributes.class || '';
      // @ts-ignore
      options.editorProps.attributes.class += ' is-editable';
    }

    const instance = new Editor(options);

    setEditor(instance);

    if (options.editable) {
      instance.on(
        'update',
        throttle(() => {
          // instance.chain().focus().scrollIntoView().run();
        }, 200)
      );
    }

    instance.on('transaction', () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          forceUpdate();
        });
      });
    });

    return () => {
      instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return editor;
};

export { EditorContent, NodeViewContent, NodeViewWrapper };
