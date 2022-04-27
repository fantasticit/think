export const loadKityMinder = async (): Promise<any> => {
  if (typeof window !== 'undefined') {
    if (window.kityminder) {
      if (window.kityminder.Editor) {
        console.log('无需重复');
        return;
      }
    }
  }

  await import('kity');
  await import('./kity-core/kityminder');
  await import('./kity-editor/expose-editor');
};
