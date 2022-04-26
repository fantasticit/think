export const loadKityMinder = async (): Promise<any> => {
  if (typeof window !== 'undefined') {
    if (window.kityminder) {
      if (window.kityminder.Editor) return;
    }
  }

  await import('kity');
  await import('./kity-core/kityminder');
  await import('./kity-editor/expose-editor');
};
