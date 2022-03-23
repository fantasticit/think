/**
 * @param {object} md Markdown object
 */
export default function splitMixedLists(md) {
  md.core.ruler.after('github-task-lists', 'split-mixed-task-lists', (state) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.attrGet('class') !== 'task-list') {
        continue;
      }
      const firstChild = tokens[i + 1];
      const startsWithTask = firstChild.attrGet('class') === 'task-list-item';
      if (!startsWithTask) {
        token.attrs.splice(token.attrIndex('class'));
        if (token.attrs.length === 0) {
          token.attrs = null;
        }
      }
      const splitBefore = findChildOf(tokens, i, (child) => {
        return child.nesting === 1 && child.attrGet('class') !== firstChild.attrGet('class');
      });
      if (splitBefore > i) {
        splitListAt(tokens, splitBefore, state.Token);
      }
    }

    return false;
  });
}

/**
 * @param {Array} tokens - all the tokens in the doc
 * @param {number} index - index into the tokens array where to split
 * @param {object} TokenConstructor - constructor provided by Markdown-it
 */
function splitListAt(tokens, index, TokenConstructor) {
  const closeList = new TokenConstructor('bullet_list_close', 'ul', -1);
  closeList.block = true;
  const openList = new TokenConstructor('bullet_list_open', 'ul', 1);
  openList.attrSet('class', 'contains-task-list');
  openList.block = true;
  tokens.splice(index, 0, closeList, openList);
}

/**
 * @param {Array} tokens - all the tokens in the doc
 * @param {number} parentIndex - index of the parent in the tokens array
 * @param {Function} predicate - test function returned child needs to pass
 */
function findChildOf(tokens, parentIndex, predicate) {
  const searchLevel = tokens[parentIndex].level + 1;
  for (let i = parentIndex + 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.level < searchLevel) {
      return -1;
    }
    if (token.level === searchLevel && predicate(tokens[i])) {
      return i;
    }
  }
  return -1;
}
