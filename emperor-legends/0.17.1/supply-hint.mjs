import { legalMoves, playMove, SUPPLY_SCHEMES } from './board.mjs';

export function supplyHint(state) {
  const goal = SUPPLY_SCHEMES[state.supply].targets.length;
  if (!state.moves || state.collected === goal) return null;
  const options = legalMoves(state.board).map(({ a, b }) => ({ a, b, next: playMove(state, a, b).state }));
  options.sort((a, b) => {
    return b.next.stock[0] + b.next.stock[1] - a.next.stock[0] - a.next.stock[1];
  });
  for (const { a, b, next } of options) {
    if (next.collected === goal || supplyHint(next)) return { a, b };
  }
  return null;
}
