import { HocuspocusProvider } from '@hocuspocus/provider';
import { Collaboration } from './extensions/collaboration';
import { CollaborationCursor } from './extensions/collaboration-cursor';
import History from '@tiptap/extension-history';
import { getRandomColor } from 'helpers/color';
import { Document } from './extensions/document';
export { BaseKit, CommentKit } from './start-kit';

export { getSchema } from '@tiptap/core';
export * from './menubar';
export * from './provider';
export * from './indexdb';
export * from './skeleton';

export const DocumentWithTitle = Document.extend({
  content: 'title block+',
});

export { Document, History };

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
