import { HocuspocusProvider } from '@hocuspocus/provider';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import History from '@tiptap/extension-history';
import { getRandomColor } from 'helpers/color';
import { Document } from './extensions/document';
import { BaseKit } from './basekit';

export { getSchema } from '@tiptap/core';
export * from './menubar';
export * from './provider';
export * from './skeleton';

export const DocumentWithTitle = Document.extend({
  content: 'title block+',
});

export { Document, History };
export const DEFAULT_EXTENSION = [...BaseKit];

export const getCollaborationExtension = (provider: HocuspocusProvider) => {
  return Collaboration.configure({
    document: provider.document,
  });
};
export const getCollaborationCursorExtension = (provider: HocuspocusProvider, user) => {
  return CollaborationCursor.configure({
    provider,
    user: {
      ...user,
      color: getRandomColor(),
    },
  });
};
