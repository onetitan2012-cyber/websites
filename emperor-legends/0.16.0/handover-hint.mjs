import { cargoRows, legalMoves, playMove } from './board.mjs';

export function handoverHint(state) {
  if (!state.moves || state.collected === 2) return null;
  const options = legalMoves(state.board).map(({ a, b }) => {
    const next = playMove(state, a, b).state;
    const rank = next.collected * 15 + cargoRows(next.board).reduce((sum, row) => sum + row, 0);
    return { a, b, next, rank };
  });
  options.sort((a, b) => b.rank - a.rank);
  for (const { a, b, next } of options) {
    if (next.collected === 2 || handoverHint(next)) return { a, b };
  }
  return null;
}
