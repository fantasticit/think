import { ReadonlyTransaction, Transaction } from 'prosemirror-state';

export const getStepRange = (transaction: Transaction | ReadonlyTransaction): { from: number; to: number } | null => {
  let from = -1;
  let to = -1;

  transaction.steps.forEach((step) => {
    step.getMap().forEach((_oldStart, _oldEnd, newStart, newEnd) => {
      from = newStart < from || from === -1 ? newStart : from;
      to = newEnd < to || to === -1 ? newEnd : to;
    });
  });

  if (from !== -1) {
    return { from, to };
  }

  return null;
};
