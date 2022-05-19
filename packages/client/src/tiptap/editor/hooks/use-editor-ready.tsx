import { useToggle } from 'hooks/use-toggle';
import { useEffect } from 'react';

import { Editor } from '../react';

export const useEditorReady = (editor: Editor, onReady?: () => void) => {
  const [isEditorReady, toggleEditorReady] = useToggle(false);

  useEffect(() => {
    const handler = () => {
      toggleEditorReady();
      onReady && onReady();
    };

    editor.on('create', handler);

    return () => {
      editor.off('create', handler);
    };
  }, [editor, toggleEditorReady, onReady]);

  return isEditorReady;
};
