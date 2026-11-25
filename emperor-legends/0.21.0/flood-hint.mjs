import { FLOOD_THRESHOLDS, legalMoves, playMove } from './board.mjs';

export function floodHint(state) {
  if (!state.moves || state.collected === FLOOD_THRESHOLDS.length) return null;
  const options = legalMoves(state.board).map(({ a, b }) => ({ a, b, next: playMove(state, a, b).state }));
  options.sort((a, b) => a.next.water - b.next.water);
  for (const { a, b, next } of options) {
    if (next.collected === FLOOD_THRESHOLDS.length || floodHint(next)) return { a, b };
  }
  return null;
}
