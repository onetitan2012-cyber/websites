import { legalMoves, playMove, QI_GOAL, QI_GRAIN_FLOOR } from './board.mjs';

export function qiHint(state) {
  if (!state.moves || state.collected === QI_GOAL || state.grain < QI_GRAIN_FLOOR) return null;
  const options = legalMoves(state.board).map(({ a, b }) => ({ a, b, next: playMove(state, a, b).state }))
    .filter(({ next }) => next.grain >= QI_GRAIN_FLOOR);
  options.sort((a, b) => b.next.collected - a.next.collected || b.next.grain - a.next.grain);
  for (const { a, b, next } of options) {
    if (next.collected === QI_GOAL || qiHint(next)) return { a, b };
  }
  return null;
}
