export const loadKityMinder = async (): Promise<any> => {
  await import('kity');
  await import('./kity-core/kityminder');
  await import('./kity-editor/expose-editor');

  const Editor = (window as any).kityminder.Editor;

  return Editor;
};
