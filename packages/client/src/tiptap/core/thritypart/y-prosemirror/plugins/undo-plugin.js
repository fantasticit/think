import { Plugin } from 'prosemirror-state'; // eslint-disable-line

import { getRelativeSelection } from './sync-plugin.js';
import { UndoManager, Item, ContentType, XmlElement, Text } from 'yjs';
import { yUndoPluginKey, ySyncPluginKey } from './keys.js';

export const undo = (state) => {
  const undoManager = yUndoPluginKey.getState(state).undoManager;
  if (undoManager != null) {
    undoManager.undo();
    return true;
  }
};

export const redo = (state) => {
  const undoManager = yUndoPluginKey.getState(state).undoManager;
  if (undoManager != null) {
    undoManager.redo();
    return true;
  }
};

export const defaultProtectedNodes = new Set(['paragraph']);

export const defaultDeleteFilter = (item, protectedNodes) =>
  !(item instanceof Item) ||
  !(item.content instanceof ContentType) ||
  !(
    item.content.type instanceof Text ||
    (item.content.type instanceof XmlElement && protectedNodes.has(item.content.type.nodeName))
  ) ||
  item.content.type._length === 0;

export const yUndoPlugin = ({ protectedNodes = defaultProtectedNodes, trackedOrigins = [], undoManager = null } = {}) =>
  new Plugin({
    key: yUndoPluginKey,
    state: {
      init: (initargs, state) => {
        // TODO: check if plugin order matches and fix
        const ystate = ySyncPluginKey.getState(state);
        const _undoManager =
          undoManager ||
          new UndoManager(ystate.type, {
            trackedOrigins: new Set([ySyncPluginKey].concat(trackedOrigins)),
            deleteFilter: (item) => defaultDeleteFilter(item, protectedNodes),
          });
        return {
          undoManager: _undoManager,
          prevSel: null,
          hasUndoOps: _undoManager.undoStack.length > 0,
          hasRedoOps: _undoManager.redoStack.length > 0,
        };
      },
      apply: (tr, val, oldState, state) => {
        const binding = ySyncPluginKey.getState(state).binding;
        const undoManager = val.undoManager;
        const hasUndoOps = undoManager.undoStack.length > 0;
        const hasRedoOps = undoManager.redoStack.length > 0;
        if (binding) {
          return {
            undoManager,
            prevSel: getRelativeSelection(binding, oldState),
            hasUndoOps,
            hasRedoOps,
          };
        } else {
          if (hasUndoOps !== val.hasUndoOps || hasRedoOps !== val.hasRedoOps) {
            return Object.assign({}, val, {
              hasUndoOps: undoManager.undoStack.length > 0,
              hasRedoOps: undoManager.redoStack.length > 0,
            });
          } else {
            // nothing changed
            return val;
          }
        }
      },
    },
    view: (view) => {
      const ystate = ySyncPluginKey.getState(view.state);
      const undoManager = yUndoPluginKey.getState(view.state).undoManager;
      undoManager.on('stack-item-added', ({ stackItem }) => {
        const binding = ystate.binding;
        if (binding) {
          stackItem.meta.set(binding, yUndoPluginKey.getState(view.state).prevSel);
        }
      });
      undoManager.on('stack-item-popped', ({ stackItem }) => {
        const binding = ystate.binding;
        if (binding) {
          binding.beforeTransactionSelection = stackItem.meta.get(binding) || binding.beforeTransactionSelection;
        }
      });
      return {
        destroy: () => {
          undoManager.destroy();
        },
      };
    },
  });
