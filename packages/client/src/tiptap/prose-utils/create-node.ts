import { Fragment, MarkType, Node as PMNode, NodeType, ResolvedPos, Schema } from 'prosemirror-model';
import { EditorState, NodeSelection, Selection, TextSelection, Transaction } from 'prosemirror-state';

export function atTheEndOfDoc(state: EditorState): boolean {
  const { selection, doc } = state;
  return doc.nodeSize - selection.$to.pos - 2 === selection.$to.depth;
}

export function atTheBeginningOfDoc(state: EditorState): boolean {
  const { selection } = state;
  return selection.$from.pos === selection.$from.depth;
}

export function atTheEndOfBlock(state: EditorState): boolean {
  const { selection } = state;
  const { $to } = selection;
  if (selection instanceof NodeSelection && selection.node.isBlock) {
    return true;
  }
  return endPositionOfParent($to) === $to.pos + 1;
}

export function endPositionOfParent(resolvedPos: ResolvedPos): number {
  return resolvedPos.end(resolvedPos.depth) + 1;
}

export function canMoveUp(state: EditorState): boolean {
  const { selection, doc } = state;

  /**
   * If there's a media element on the selection,
   * add text blocks with arrow navigation.
   * Also, the selection could be media | mediaGroup.
   */
  if (selection instanceof NodeSelection) {
    if (selection.node.type.name === 'media') {
      /** Weird way of checking if the previous element is a paragraph */
      const mediaAncestorNode = doc.nodeAt(selection.anchor - 3);
      return !!(mediaAncestorNode && mediaAncestorNode.type.name === 'paragraph');
    } else if (selection.node.type.name === 'mediaGroup') {
      const mediaGroupAncestorNode = selection.$anchor.nodeBefore;
      return !!(mediaGroupAncestorNode && mediaGroupAncestorNode.type.name === 'paragraph');
    }
  }

  if (selection instanceof TextSelection) {
    if (!selection.empty) {
      return true;
    }
  }

  return !atTheBeginningOfDoc(state);
}

export function canMoveDown(state: EditorState): boolean {
  const { selection, doc } = state;

  /**
   * If there's a media element on the selection,
   * add text blocks with arrow navigation.
   * Also, the selection could be media | mediaGroup.
   */
  if (selection instanceof NodeSelection) {
    if (selection.node.type.name === 'media') {
      const nodeAfter = doc.nodeAt(selection.$head.after());
      return !!(nodeAfter && nodeAfter.type.name === 'paragraph');
    } else if (selection.node.type.name === 'mediaGroup') {
      return !(selection.$head.parentOffset === selection.$anchor.parent.content.size);
    }
  }
  if (selection instanceof TextSelection) {
    if (!selection.empty) {
      return true;
    }
  }

  return !atTheEndOfDoc(state);
}

export function preventDefault() {
  return function () {
    return true;
  };
}

export function insertNewLine() {
  return function (state, dispatch) {
    const { $from } = state.selection;
    const parent = $from.parent;
    const { hardBreak } = state.schema.nodes;

    if (hardBreak) {
      const hardBreakNode = hardBreak.createChecked();

      if (parent && parent.type.validContent(Fragment.from(hardBreakNode))) {
        if (dispatch) {
          dispatch(state.tr.replaceSelectionWith(hardBreakNode, false));
        }
        return true;
      }
    }

    if (state.selection instanceof TextSelection) {
      if (dispatch) {
        dispatch(state.tr.insertText('\n'));
      }
      return true;
    }

    return false;
  };
}

export const createNewParagraphAbove = (state, dispatch) => {
  const append = false;
  if (!canMoveUp(state) && canCreateParagraphNear(state)) {
    createParagraphNear(append)(state, dispatch);
    return true;
  }

  return false;
};

export const createNewParagraphBelow = (state, dispatch) => {
  const append = true;
  if (!canMoveDown(state) && canCreateParagraphNear(state)) {
    createParagraphNear(append)(state, dispatch);
    return true;
  }

  return false;
};

function canCreateParagraphNear(state: EditorState): boolean {
  const {
    selection: { $from },
  } = state;
  const node = $from.node($from.depth);
  const insideCodeBlock = !!node && node.type === state.schema.nodes.codeBlock;
  const isNodeSelection = state.selection instanceof NodeSelection;
  return $from.depth > 1 || isNodeSelection || insideCodeBlock;
}

export function createParagraphNear(append = true) {
  return function (state, dispatch) {
    const paragraph = state.schema.nodes.paragraph;

    if (!paragraph) {
      return false;
    }

    let insertPos;

    if (state.selection instanceof TextSelection) {
      if (topLevelNodeIsEmptyTextBlock(state)) {
        return false;
      }
      insertPos = getInsertPosFromTextBlock(state, append);
    } else {
      insertPos = getInsertPosFromNonTextBlock(state, append);
    }

    const tr = state.tr.insert(insertPos, paragraph.createAndFill() as PMNode);
    tr.setSelection(TextSelection.create(tr.doc, insertPos + 1));

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

function getInsertPosFromTextBlock(state: EditorState, append: boolean): number {
  const { $from, $to } = state.selection;
  let pos;
  if (!append) {
    pos = $from.start(0);
  } else {
    pos = $to.end(0);
  }
  return pos;
}

function getInsertPosFromNonTextBlock(state: EditorState, append: boolean): number {
  const { $from, $to } = state.selection;
  const nodeAtSelection = state.selection instanceof NodeSelection && state.doc.nodeAt(state.selection.$anchor.pos);
  const isMediaSelection = nodeAtSelection && nodeAtSelection.type.name === 'mediaGroup';

  let pos;
  if (!append) {
    // The start position is different with text block because it starts from 0
    pos = $from.start($from.depth);
    // The depth is different with text block because it starts from 0
    pos = $from.depth > 0 && !isMediaSelection ? pos - 1 : pos;
  } else {
    pos = $to.end($to.depth);
    pos = $to.depth > 0 && !isMediaSelection ? pos + 1 : pos;
  }
  return pos;
}

function topLevelNodeIsEmptyTextBlock(state: EditorState): boolean {
  const topLevelNode = state.selection.$from.node(1);
  return topLevelNode.isTextblock && topLevelNode.type !== state.schema.nodes.codeBlock && topLevelNode.nodeSize === 2;
}

export function addParagraphAtEnd(tr: Transaction) {
  const {
    doc: {
      type: {
        schema: {
          nodes: { paragraph },
        },
      },
    },
    doc,
  } = tr;
  if (doc.lastChild && !(doc.lastChild.type === paragraph && doc.lastChild.content.size === 0)) {
    if (paragraph) {
      tr.insert(doc.content.size, paragraph.createAndFill() as PMNode);
    }
  }
  tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size - 1));
  tr.scrollIntoView();
}

export function createParagraphAtEnd() {
  return function (state, dispatch) {
    const { tr } = state;
    addParagraphAtEnd(tr);
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}
