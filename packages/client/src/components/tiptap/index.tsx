import {
  BaseExtension,
  Document,
  TitledDocument as DocumentWithTitle,
} from "./base-kit";
import { HocuspocusProvider } from "@hocuspocus/provider";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { getRandomColor } from "helpers/color";

export { getSchema } from "@tiptap/core";
export * from "./menubar";
export * from "./provider";
export * from "./skeleton";
export * from "./toc";

export { Document, DocumentWithTitle };
export const DEFAULT_EXTENSION = [...BaseExtension];
export const getCollaborationExtension = (provider: HocuspocusProvider) => {
  return Collaboration.configure({
    document: provider.document,
  });
};
export const getCollaborationCursorExtension = (
  provider: HocuspocusProvider,
  user
) => {
  return CollaborationCursor.configure({
    provider,
    user: {
      ...user,
      color: getRandomColor(),
    },
  });
};
