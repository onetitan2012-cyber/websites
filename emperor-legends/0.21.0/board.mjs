export const SIZE = 7;
export const TARGET = 8;
export const STEPS = 12;
export const SHADE = 0;
export const SEED = 257;
export const MILESTONES = [3, 6, 8];
export const ROADBLOCK = -1;
export const ROAD_CELLS = [16, 25, 36];
export const ROAD_GOAL = ROAD_CELLS.length;
export const ROAD_STEPS = 14;
const ROAD_SEED = 2216;
export const TRIAL_SEED = 17;
export const TRIAL_STEPS = 4;
const TRIAL_CELLS = [16, 25, 38];
const GATE_HITS = 2;
export const COUNCIL_STEPS = 4;
const COUNCIL_CELLS = [16, 25, 38];
const COUNCIL_SEED = 145;
export const COUNCIL_REVIEW_HITS = 3;
export const CROWN_STEPS = 4;
export const CROWN_HITS = 2;
export const CROWN_POSTS = [21, 27];
const CROWN_SEED = 261;
export const PETITION_STEPS = 4;
export const PETITION_TARGET = 3;
export const PETITION_HEAD_START = 1;
const PETITION_SEED = 176;
export const HANDOVER_STEPS = 4;
export const CARGO = [4, 5];
const HANDOVER_COLUMNS = [1, 5];
export const CARGO_DESTINATIONS = HANDOVER_COLUMNS.map(column => SIZE * (SIZE - 1) + column);
const HANDOVER_SEED = 244;
export const RETURN_STEPS = 4;
export const RETURN_CELLS = [10, 24, 36];
const RETURN_SEED = 324;
export const HALL_STEPS = 5;
export const HALL_COLUMNS = [1, 5];
export const HALL_GOAL = 4;
const HALL_SEED = 604;
export const FLOOD_STEPS = 5;
export const FLOOD_START = 10;
export const FLOOD_RISE = 2;
export const WATER_PIECE = 3;
export const FLOOD_THRESHOLDS = [8, 5, 2];
const FLOOD_SEED = 568;
export const SUPPLY_PIECES = [0, 3];
export const SUPPLY_SCHEMES = {
  swift: { moves: 3, targets: [[3, 0], [6, 0], [8, 0]] },
  steady: { moves: 5, targets: [[4, 4], [8, 8]] },
};
const SUPPLY_SEEDS = { swift: 223, steady: 559 };
export const REGISTER_STEPS = 4;
export const REGISTER_AXES = ['row', 'column'];
const REGISTER_SEED = 482;
export const QI_STEPS = 5;
export const QI_GOAL = 8;
export const QI_GRAIN_START = 10;
export const QI_GRAIN_FLOOR = 4;
export const QI_REGISTER = 3;
export const QI_GRAIN = 2;
const QI_SEED = 226;

export const FOLIO_MARKS = [16, 16, 32];
export function createFolioGame(seed = 227) {
  const state = { seed, moves: 5, collected: 0, folio: true };
  const board = makeBoard(state);
  return { ...state, board };
}

function goalFor(state) {
  if (state.folio) return FOLIO_MARKS.length;
  if (state.qi) return QI_GOAL;
  if (state.register) return REGISTER_AXES.length;
  if (state.supply) return SUPPLY_SCHEMES[state.supply].targets.length;
  if (state.flood) return FLOOD_THRESHOLDS.length;
  if (state.hall) return HALL_GOAL;
  if (state.returned) return RETURN_CELLS.length;
  return state.handover ? CARGO.length : state.petition ? 2 : state.crown ? CROWN_POSTS.length : state.road ? ROAD_GOAL : TARGET;
}

function matchable(value) { return value >= 0 && value < CARGO[0]; }

function randomPiece(state) {
  state.seed = (Math.imul(state.seed, 1664525) + 1013904223) >>> 0;
  return state.seed >>> 30;
}

function scan(board) {
  const runs = [];
  for (const stride of [1, SIZE]) {
    for (let line = 0; line < SIZE; line += 1) {
      const base = line * (stride === 1 ? SIZE : 1);
      let start = 0;
      while (start < SIZE) {
        const color = board[base + start * stride];
        let end = start + 1;
        while (end < SIZE && board[base + end * stride] === color) end += 1;
        if (matchable(color) && end - start >= 3) {
          const cells = Array.from({ length: end - start }, (_, i) => base + (start + i) * stride);
          let bonus;
          if (cells.length >= 4) {
            if (end < SIZE) bonus = base + end * stride;
            else if (start > 0) bonus = base + (start - 1) * stride;
          }
          runs.push({ cells, bonus, axis: stride === 1 ? 'row' : 'column', line });
        }
        start = end;
      }
    }
  }
  return runs;
}

function swapped(board, a, b) {
  const next = board.slice();
  [next[a], next[b]] = [next[b], next[a]];
  return next;
}

function distance(a, b) {
  return Math.abs(Math.floor(a / SIZE) - Math.floor(b / SIZE)) + Math.abs(a % SIZE - b % SIZE);
}

function opensRoad(runs, blocker) {
  return blocker >= 0 && runs.some(run => run.cells.some(index => distance(index, blocker) === 1));
}

function chargeId({ axis, line }) { return axis + '-' + line; }

export function legalMoves(board, trial = false) {
  const blocker = board.indexOf(ROADBLOCK);
  const moves = [];
  for (let a = 0; a < board.length; a += 1) {
    for (const b of [a + 1, a + SIZE]) {
      if (b >= board.length || distance(a, b) !== 1 || board[a] === board[b]
          || !matchable(board[a]) || !matchable(board[b])) continue;
      const swap = swapped(board, a, b);
      const runs = scan(swap);
      if (!runs.length) continue;
      const target = new Set(runs.flatMap(({ cells }) => cells).filter(index => swap[index] === SHADE)).size;
      if (blocker >= 0) {
        const proximity = Math.min(...runs.flatMap(({ cells }) => cells.map(index => distance(index, blocker))));
        const opens = opensRoad(runs, blocker);
        const move = { a, b, target, opens, proximity };
        if (trial) move.charges = runs.filter(run => run.cells.length >= 4).map(chargeId);
        moves.push(move);
      } else {
        moves.push({ a, b, target });
      }
    }
  }
  return blocker >= 0
    ? moves.sort((a, b) => Number(b.opens) - Number(a.opens) || a.proximity - b.proximity)
    : moves.sort((a, b) => b.target - a.target);
}

function makeBoard(state, blockers = [], cargo = []) {
  let board;
  do {
    board = [];
    for (let index = 0; index < SIZE * SIZE; index += 1) {
      if (blockers.includes(index)) {
        board.push(ROADBLOCK);
        continue;
      }
      const loaded = cargo.indexOf(index);
      if (loaded >= 0) {
        board.push(CARGO[loaded]);
        continue;
      }
      let color;
      do {
        color = randomPiece(state);
      } while ((index % SIZE >= 2 && board[index - 1] === color && board[index - 2] === color)
        || (index >= SIZE * 2 && board[index - SIZE] === color && board[index - SIZE * 2] === color));
      board.push(color);
    }
  } while (!legalMoves(board).length);
  return board;
}

export function createGame(seed = SEED) {
  const state = { seed, moves: STEPS, collected: 0 };
  return { ...state, board: makeBoard(state), seed: state.seed };
}

export function createRoadGame(seed = ROAD_SEED) {
  const state = { seed, moves: ROAD_STEPS, collected: 0, road: true };
  const board = makeBoard(state, [ROAD_CELLS[0]]);
  return { ...state, board };
}

export function createTrialGame(tactics, seed = TRIAL_SEED) {
  const state = { seed, moves: TRIAL_STEPS, collected: 0, road: true, trial: true, gateHits: 0 };
  const board = makeBoard(state, [TRIAL_CELLS[0]]);
  return tactics ? { ...state, board, charges: [] } : { ...state, board };
}

export function createCouncilGame(seed = COUNCIL_SEED) {
  const state = { seed, moves: COUNCIL_STEPS, collected: 0, road: true, council: true, gateHits: 0, charges: [] };
  const board = makeBoard(state, [COUNCIL_CELLS[0]]);
  return { ...state, board };
}

export function createCrownGame(seed = CROWN_SEED) {
  const state = { seed, moves: CROWN_STEPS, collected: 0, road: true, crown: true, marks: [0, 0], charges: [] };
  const board = makeBoard(state, CROWN_POSTS);
  return { ...state, board };
}

export function createPetitionGame(first = 0, seed = PETITION_SEED) {
  const evidence = first === 1 ? [0, PETITION_HEAD_START] : [PETITION_HEAD_START, 0];
  const state = { seed, moves: PETITION_STEPS, collected: 0, petition: true, evidence };
  const board = makeBoard(state);
  return { ...state, board };
}

export function cargoRows(board) {
  return CARGO.map(piece => Math.floor(board.indexOf(piece) / SIZE));
}

export function createHandoverGame(first = 0, seed = HANDOVER_SEED) {
  const state = { seed, moves: HANDOVER_STEPS, collected: 0, handover: true };
  const positioned = HANDOVER_COLUMNS.map((column, index) => column + SIZE * (index === first ? 4 : 2));
  let board;
  do {
    board = makeBoard(state);
    positioned.forEach((position, index) => { board[position] = CARGO[index]; });
  } while (!legalMoves(board).length);
  return { ...state, board };
}

export function createReturnGame(seed = RETURN_SEED) {
  const state = { seed, moves: RETURN_STEPS, collected: 0, returned: true, found: RETURN_CELLS.map(() => false) };
  const board = makeBoard(state);
  return { ...state, board };
}

export function hallSide(first, progress, priority) {
  if (progress === 0) return first;
  if (progress === 1 && !priority) return null;
  if (progress === 1) return priority === 'lead' ? first : 1 - first;
  if (progress === 2) return priority === 'lead' ? 1 - first : first;
  return 1 - first;
}

export function hallCounts(first, progress, priority) {
  const counts = [0, 0];
  for (let step = 0; step < progress; step++) counts[hallSide(first, step, priority)]++;
  return counts;
}

export function createHallGame(first = 0, seed = HALL_SEED) {
  const state = { seed, moves: HALL_STEPS, collected: 0, hall: true, priority: null, first: first === 1 ? 1 : 0 };
  const board = makeBoard(state);
  return { ...state, board };
}

export function floodStages(water) {
  return FLOOD_THRESHOLDS.filter(threshold => water <= threshold).length;
}

export function createFloodGame(seed = FLOOD_SEED) {
  const state = { seed, moves: FLOOD_STEPS, collected: floodStages(FLOOD_START), water: FLOOD_START, flood: true };
  const board = makeBoard(state);
  return { ...state, board };
}

export function createSupplyGame(supply, seed = SUPPLY_SEEDS[supply]) {
  const state = { seed, moves: SUPPLY_SCHEMES[supply].moves, collected: 0, supply, stock: [0, 0] };
  const board = makeBoard(state);
  return { ...state, board };
}

export function createRegisterGame(seed = REGISTER_SEED) {
  const state = { seed, moves: REGISTER_STEPS, collected: 0, register: true, bound: [false, false] };
  const board = makeBoard(state);
  return { ...state, board };
}

export function createQiGame(seed = QI_SEED) {
  const state = { seed, moves: QI_STEPS, collected: 0, grain: QI_GRAIN_START, qi: true };
  const board = makeBoard(state);
  return { ...state, board };
}

export function roadCells(state) {
  return state.council ? COUNCIL_CELLS : state.trial ? TRIAL_CELLS : ROAD_CELLS;
}

export function gateHitsRemaining(state) {
  if (state.collected !== ROAD_GOAL - 1) return 0;
  if (state.council) return COUNCIL_REVIEW_HITS - state.gateHits;
  return state.trial ? GATE_HITS - state.gateHits : 0;
}

export function chargeCells({ axis, line }) {
  return Array.from({ length: SIZE }, (_, index) => axis === 'row' ? line * SIZE + index : index * SIZE + line);
}

function collapse(board, removed, state) {
  const next = board.slice();
  const drops = Array(board.length).fill(0);
  for (let column = 0; column < SIZE; column += 1) {
    let bottom = SIZE - 1;
    while (bottom >= 0) {
      const base = bottom * SIZE + column;
      if (board[base] === ROADBLOCK && !removed.has(base)) {
        bottom -= 1;
        continue;
      }
      let first = bottom;
      while (first > 0) {
        const above = (first - 1) * SIZE + column;
        if (board[above] === ROADBLOCK && !removed.has(above)) break;
        first -= 1;
      }
      let target = bottom;
      for (let row = bottom; row >= first; row -= 1) {
        const source = row * SIZE + column;
        if (removed.has(source)) continue;
        const destination = target * SIZE + column;
        next[destination] = board[source];
        drops[destination] = target - row;
        target -= 1;
      }
      const blanks = target - first + 1;
      for (let row = first; row <= target; row += 1) {
        const index = row * SIZE + column;
        next[index] = randomPiece(state);
        drops[index] = blanks;
      }
      bottom = first - 1;
    }
  }
  return { board: next, drops };
}

export function playMove(state, a, b) {
  const goal = goalFor(state);
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0
      || a >= state.board.length || b >= state.board.length || distance(a, b) !== 1
      || state.moves <= 0 || state.collected >= goal || state.board[a] === state.board[b]
      || (state.hall && state.collected === 1 && !state.priority)
      || (state.qi && state.grain < QI_GRAIN_FLOOR)
      || !matchable(state.board[a]) || !matchable(state.board[b])) return null;
  const swap = swapped(state.board, a, b);
  const runs = scan(swap);
  return runs.length ? resolveTurn(state, swap, runs) : null;
}

export function useCharge(state, id) {
  const charge = state.charges?.find(item => item.id === id);
  if (!charge || state.moves <= 0 || state.collected >= goalFor(state)) return null;
  return resolveTurn(state, state.board, [], charge);
}

function verifyPosts(next, worked, runs, beam, removed) {
  for (const [index, position] of CROWN_POSTS.entries()) {
    if (worked.has(index) || next.marks[index] === CROWN_HITS) continue;
    const direct = beam?.includes(position);
    const touches = beam ? beam.some(cell => distance(cell, position) <= 1) : opensRoad(runs, position);
    if (!touches) continue;
    worked.add(index);
    next.marks[index] = direct ? CROWN_HITS : next.marks[index] + 1;
    if (next.marks[index] === CROWN_HITS) {
      removed.add(position);
      next.collected += 1;
    }
  }
}

function resolveTurn(state, swap, runs, charge) {
  const goal = goalFor(state);
  const next = { ...state, moves: state.moves - 1 };
  if (state.flood) next.water += FLOOD_RISE;
  const tactics = Boolean(state.charges);
  if (tactics) next.charges = state.charges.filter(item => item.id !== charge?.id);
  const workedPosts = new Set();
  const reviewedEvidence = new Set();
  if (state.crown) next.marks = state.marks.slice();
  if (state.petition) next.evidence = state.evidence.slice();
  if (state.returned) next.found = state.found.slice();
  if (state.supply) next.stock = state.stock.slice();
  const waves = [];
  let gateWorked = false;
  let board = swap;
  let beam = charge ? chargeCells(charge) : null;
  const hallColumn = state.hall ? HALL_COLUMNS[hallSide(state.first, state.collected, state.priority)] : -1;
  while (runs.length || beam) {
    const blocker = board.indexOf(ROADBLOCK);
    const removed = new Set(beam ?? runs.flatMap(({ cells, bonus }) =>
      tactics || state.petition || state.handover || state.returned || state.folio || state.hall || state.flood || state.supply || state.register || state.qi
        || bonus === undefined || bonus === blocker
        ? cells : [...cells, bonus]));
    const earned = [];
    if (tactics) {
      for (const run of runs) {
        if (run.cells.length < 4) continue;
        const id = chargeId(run);
        if (next.charges.some(item => item.id === id)) continue;
        const token = { id, axis: run.axis, line: run.line };
        next.charges.push(token);
        earned.push(token);
      }
    }
    const previous = next.collected;
    if (state.qi) {
      for (const cell of removed) {
        if (board[cell] === QI_REGISTER && next.collected < QI_GOAL) next.collected += 1;
        if (board[cell] === QI_GRAIN && next.grain > 0) next.grain -= 1;
      }
    } else if (state.folio) {
      const mark = FOLIO_MARKS[state.collected];
      if ([...removed].some(cell => distance(cell, mark) === 1)) next.collected = state.collected + 1;
    } else if (state.register) {
      next.bound = next.bound.map((bound, index) => bound
        || runs.some(run => run.axis === REGISTER_AXES[index] && run.cells.length >= 4));
      next.collected = next.bound.filter(Boolean).length;
    } else if (state.supply) {
      const targets = SUPPLY_SCHEMES[state.supply].targets;
      const limit = targets.at(-1);
      for (const cell of removed) {
        const kind = SUPPLY_PIECES.indexOf(board[cell]);
        if (kind >= 0 && next.stock[kind] < limit[kind]) next.stock[kind] += 1;
      }
      next.collected = targets.filter(target => target.every((amount, index) => next.stock[index] >= amount)).length;
    } else if (state.flood) {
      next.water -= [...removed].filter(cell => board[cell] === WATER_PIECE).length;
    } else if (state.hall) {
      const directed = state.collected < 2;
      if (next.collected === state.collected && (directed || [...removed].some(cell => cell % SIZE === hallColumn))) next.collected += 1;
    } else if (state.returned) {
      next.found = next.found.map((found, index) => found || removed.has(RETURN_CELLS[index]));
      next.collected = next.found.filter(Boolean).length;
    } else if (state.petition) {
      for (const cell of removed) {
        const color = board[cell];
        if ((color !== 0 && color !== 1) || reviewedEvidence.has(color)) continue;
        reviewedEvidence.add(color);
        next.evidence[color] = Math.min(PETITION_TARGET, next.evidence[color] + 1);
      }
      next.collected = next.evidence.filter(count => count === PETITION_TARGET).length;
    } else if (state.crown) {
      verifyPosts(next, workedPosts, runs, beam, removed);
    } else if (state.road) {
      const opened = beam
        ? blocker >= 0 && beam.some(index => distance(index, blocker) <= 1)
        : opensRoad(runs, blocker);
      if (opened) {
        const gate = gateHitsRemaining(next);
        if (!gate || !gateWorked) {
          const directHit = beam?.includes(blocker);
          if (gate) {
            next.gateHits += directHit ? gate : 1;
            gateWorked = true;
          }
          if (gate <= 1 || directHit) {
            removed.add(blocker);
            next.collected += 1;
          }
        }
      }
    } else if (!state.handover) {
      const amount = [...removed].filter(index => board[index] === SHADE).length;
      next.collected = Math.min(goal, previous + amount);
    }
    const milestones = state.crown || state.petition || state.handover || state.returned || state.folio || state.hall || state.flood || state.supply || state.register || state.qi
      ? [] : state.road
      ? (previous < next.collected ? [next.collected] : [])
      : MILESTONES.filter(count => previous < count && next.collected >= count);
    const fallen = collapse(board, removed, next);
    const cargo = state.handover ? cargoRows(fallen.board) : null;
    if (cargo) next.collected = cargo.filter(row => row === SIZE - 1).length;
    const wave = { removed: [...removed], collected: next.collected, milestones, ...fallen };
    if (state.register) wave.bound = next.bound;
    if (cargo) wave.cargo = cargo;
    if (state.returned) wave.found = next.found;
    if (state.crown) wave.marks = next.marks.slice();
    if (state.petition) wave.evidence = next.evidence.slice();
    if (tactics) {
      wave.charges = next.charges.slice();
      wave.earned = earned;
    }
    waves.push(wave);
    board = fallen.board;
    runs = scan(board);
    beam = null;
  }
  const waterCleared = state.flood ? state.water + FLOOD_RISE - next.water : 0;
  if (state.flood) {
    next.water = Math.max(0, next.water);
    next.collected = floodStages(next.water);
  }
  const nextBlocker = state.road && !state.crown && next.collected < goal ? roadCells(state)[next.collected] : -1;
  if (nextBlocker >= 0 && next.collected > state.collected) {
    board = board.slice();
    board[nextBlocker] = ROADBLOCK;
  }
  const reshuffled = next.moves > 0 && next.collected < goal && (!state.qi || next.grain >= QI_GRAIN_FLOOR)
    && !legalMoves(board).length;
  const blockers = state.crown ? CROWN_POSTS.filter((_, index) => next.marks[index] < CROWN_HITS)
    : nextBlocker >= 0 ? [nextBlocker] : [];
  next.board = reshuffled ? makeBoard(next, blockers, state.handover ? CARGO.map(piece => board.indexOf(piece)) : []) : board;
  return { state: next, swap, waves, reshuffled, ...(state.flood ? { waterCleared } : {}) };
}
