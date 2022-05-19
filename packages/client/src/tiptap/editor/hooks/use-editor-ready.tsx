import { useToggle } from 'hooks/use-toggle';
import { useEffect } from 'react';

import { Editor } from '../react';

export const useEditorReady = (editor: Editor) => {
  const [isEditorReady, toggleEditorReady] = useToggle(false);

  useEffect(() => {
    editor.on('create', toggleEditorReady);

    return () => {
      editor.off('create', toggleEditorReady);
    };
  }, [editor, toggleEditorReady]);

  return isEditorReady;
};
