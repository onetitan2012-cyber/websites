import { chargeCells, legalMoves, playMove, ROAD_GOAL, roadCells, useCharge } from './board.mjs';

export function councilHint(state) {
  const filesLeft = ROAD_GOAL - state.collected;
  if (filesLeft <= 0 || state.moves < filesLeft) return null;

  const lastFile = roadCells(state).at(-1);
  const charges = state.charges.filter(charge => chargeCells(charge).includes(lastFile));
  if (filesLeft === 1 && charges.length) return { charge: charges[0].id };

  const moves = legalMoves(state.board);
  for (const { a, b } of moves) {
    const { state: next } = playMove(state, a, b);
    if (next.collected === ROAD_GOAL || councilHint(next)) return { a, b };
  }
  // A charge can also clear an earlier file if its line reaches that file.
  for (const { id } of state.charges) {
    const { state: next } = useCharge(state, id);
    if (next.collected === ROAD_GOAL || councilHint(next)) return { charge: id };
  }
  return null;
}
