export {
  absolutePositionToRelativePosition,
  prosemirrorJSONToYDoc,
  prosemirrorToYDoc,
  relativePositionToAbsolutePosition,
  setMeta,
  yDocToProsemirror,
  yDocToProsemirrorJSON,
} from './lib.js';
export * from './plugins/cursor-plugin.js';
export * from './plugins/keys.js';
export { getRelativeSelection, isVisible, ProsemirrorBinding, ySyncPlugin } from './plugins/sync-plugin.js';
export * from './plugins/undo-plugin.js';
