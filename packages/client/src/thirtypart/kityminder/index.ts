export const load = async (): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      if (window.kityminder) {
        if (window.kityminder.Editor) return;
      }
    }

    await import('kity');
    await import('./kity-core/kityminder');
    await import('./kity-editor/expose-editor');
  } catch (e) {
    throw new Error(e);
  }
};

type Options = {
  container: HTMLElement;
  isEditable: boolean;
  data?: Record<string, unknown>;
};

export function renderMind(options: Options) {
  const Editor = window.kityminder.Editor;
  const editor = new Editor(options.container);
  const mind = editor.minder;

  options.data && mind.importJson(options.data);

  if (!options.isEditable) {
    mind.disable();
  }

  setTimeout(() => {
    mind.execCommand('camera');
  }, 0);

  return mind;
}
