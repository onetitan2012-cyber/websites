import { legalMoves, playMove, REGISTER_AXES } from './board.mjs';

export function registerHint(state) {
  if (!state.moves || state.collected === REGISTER_AXES.length) return null;
  const options = legalMoves(state.board).map(({ a, b }) => ({ a, b, next: playMove(state, a, b).state }));
  options.sort((a, b) => b.next.collected - a.next.collected);
  for (const { a, b, next } of options) {
    if (next.collected === REGISTER_AXES.length || registerHint(next)) return { a, b };
  }
  return null;
}
