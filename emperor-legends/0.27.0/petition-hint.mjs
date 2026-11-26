import { legalMoves, PETITION_TARGET, playMove } from './board.mjs';

export function petitionHint(state) {
  if (!state.moves || state.collected === 2
      || state.evidence.some(count => PETITION_TARGET - count > state.moves)) return null;
  const options = legalMoves(state.board).map(({ a, b }) => {
    const next = playMove(state, a, b).state;
    return { a, b, next, need: next.evidence.reduce((total, count) => total + PETITION_TARGET - count, 0) };
  });
  options.sort((a, b) => a.need - b.need);
  for (const { a, b, next } of options) {
    if (next.collected === 2 || petitionHint(next)) return { a, b };
  }
  return null;
}
