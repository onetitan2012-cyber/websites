import { legalMoves, playMove, RETURN_CELLS } from './board.mjs';

export function returnHint(state) {
  if (!state.moves || state.collected === RETURN_CELLS.length) return null;
  const options = legalMoves(state.board).map(({ a, b }) => ({ a, b, next: playMove(state, a, b).state }));
  options.sort((a, b) => b.next.collected - a.next.collected);
  for (const { a, b, next } of options) {
    if (next.collected === RETURN_CELLS.length || returnHint(next)) return { a, b };
  }
  return null;
}
