import { chargeCells, CROWN_HITS, CROWN_POSTS, legalMoves, playMove, useCharge } from './board.mjs';

export function crownHint(state) {
  if (!state.moves || state.collected === CROWN_POSTS.length) return null;
  const activePosts = CROWN_POSTS.filter((_, index) => state.marks[index] < CROWN_HITS);
  const direct = state.charges.find(charge => activePosts.every(position => chargeCells(charge).includes(position)));
  if (direct) return { charge: direct.id };

  for (const { a, b } of legalMoves(state.board)) {
    const next = playMove(state, a, b).state;
    if (next.collected === CROWN_POSTS.length || crownHint(next)) return { a, b };
  }
  for (const { id } of state.charges) {
    const next = useCharge(state, id).state;
    if (next.collected === CROWN_POSTS.length || crownHint(next)) return { charge: id };
  }
  return null;
}
