import { HALL_GOAL, legalMoves, playMove } from './board.mjs';

export function hallHint(state) {
  if (state.collected === HALL_GOAL || HALL_GOAL - state.collected > state.moves) return null;
  const options = legalMoves(state.board).map(({ a, b }) => ({ a, b, next: playMove(state, a, b).state }));
  options.sort((a, b) => b.next.collected - a.next.collected);
  for (const { a, b, next } of options) {
    if (next.collected === HALL_GOAL || hallHint(next)) return { a, b };
  }
  return null;
}
