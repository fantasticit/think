import { useState, useEffect, DependencyList } from 'react';
import { EditorOptions } from '@tiptap/core';
import { Editor } from '@tiptap/react';

function useForceUpdate() {
  const [, setValue] = useState(0);

  return () => setValue((value) => value + 1);
}

export const useEditor = (options: Partial<EditorOptions> = {}, deps: DependencyList = []) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const instance = new Editor(options);

    setEditor(instance);

    // instance.on('transaction', () => {
    //   requestAnimationFrame(() => {
    //     requestAnimationFrame(() => {
    //       console.log('update');
    //       forceUpdate();
    //     });
    //   });
    // });

    return () => {
      instance.destroy();
    };
  }, deps);

  return editor;
};
