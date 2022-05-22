import { EditorOptions } from '@tiptap/core';
import { Editor as BuiltInEditor } from '@tiptap/react';
import { EventEmitter } from 'helpers/event-emitter';
import { DependencyList, useEffect, useState } from 'react';

function useForceUpdate() {
  const [, setValue] = useState(0);

  return () => setValue((value) => value + 1);
}

export class Editor extends BuiltInEditor {
  public eventEmitter: EventEmitter = new EventEmitter();
}

export const useEditor = (options: Partial<EditorOptions> = {}, deps: DependencyList = []) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const instance = new Editor(options);

    setEditor(instance);

    if (!options.editable) {
      instance.on('transaction', () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            forceUpdate();
          });
        });
      });
    }

    return () => {
      instance.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return editor;
};
